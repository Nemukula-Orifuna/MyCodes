# Part 6 — Model Answers: Test 1B, Test 2 2025, Test 2 2026, Bluetooth Exercises and Error-Detection Worksheet

Conventions as in Part 5. Where a question is identical to one already answered in Part 5, the answer says so and gives any extra depth the higher mark allocation needs.

---

# COM5231 TEST 1, VERSION B (T1B; 100 marks)

### Q1. Explain the difference between single-bit and burst errors and the extent to which parity checking is appropriate as an error-detecting technique in both cases. (10)
*Definitions SUPPLEMENTARY (standard; the worksheet [ED] lists this question but gives no theory). Causes from [WC-B].*

**Single-bit error (2 marks)**: **only one bit** of a data unit (byte, frame) is changed, from 0 to 1 or 1 to 0. E.g. 0000 0010 sent, 0000 1010 received. These are relatively **rare** in practice, because noise usually lasts longer than one bit time.

**Burst error (3 marks)**: **two or more bits** in the data unit are changed. They need not be consecutive. The **burst length** runs from the **first** corrupted bit to the **last**, inclusive. Bursts are the **common case** in wireless: **impulse noise** (*"the primary source of error in digital data… a 0.01 s spike… would wash out about 10 000 bits at 1 Mbps"* [WC-B 5.2]) and **fading** dips of 20–30 dB [WC-B 5.3] corrupt many consecutive bits.

**Parity checking** (even parity: one bit appended so the number of 1s is even; the receiver recounts):
- **Single-bit errors (2 marks)**: parity **always detects** them. One flipped bit changes the count of 1s from even to odd. It is **cheap** (one extra bit) and simple, so it is **appropriate** where errors are isolated. It **cannot correct** them, though: it can't tell **which** bit flipped, so retransmission is needed.
- **Burst errors (3 marks)**: parity detects a burst **only if an odd number of bits** is flipped. Any **even** number of errors (2, 4, …) leaves the parity unchanged and goes **undetected**. E.g. 10110010 → 1**10**10010: two errors, still four 1s, so it passes. Roughly **half of all bursts escape**, so single parity is **not appropriate** for bursty wireless channels. **Two-dimensional parity** improves this (it detects many bursts and corrects single errors), but **CRC** is preferred, since it detects **all bursts of length ≤ r** (the number of check bits).

### Q2. Transmit the message 10011010 protected by the CRC polynomial x³ + x² + 1.
#### (a) Use polynomial long division to determine the message that should be transmitted. (10)
1. **Generator**: x³ + x² + 0·x + 1 → **1101**; degree r = **3**.
2. **Append 3 zeros**: M(x)·x³ → **10011010 000**.
3. **Divide by 1101 (modulo-2)**:

| Step | Leading window | XOR 1101 | Result | Remaining dividend |
|---|---|---|---|---|
| 1 | 1001 | 1101 | 0100 | 0100 1010 000 |
| 2 | 1001 | 1101 | 0100 | 0010 0010 000 |
| 3 | 1000 | 1101 | 0101 | 0001 0110 000 |
| 4 | 1011 | 1101 | 0110 | 0000 1100 000 |
| 5 | 1100 | 1101 | 0001 | 0000 0001 000 |
| 6 | 1000 | 1101 | 0101 | 0000 0000 101 |

```
            1 0 0 1 1 0 1 0 0 0 0
            1 1 0 1
            -------
              1 0 0 1
              1 1 0 1
              -------
                1 0 0 0
                1 1 0 1
                -------
                  1 0 1 1
                  1 1 0 1
                  -------
                    1 1 0 0
                    1 1 0 1
                    -------
                          1 0 0 0
                          1 1 0 1
                          -------
                            1 0 1   = remainder
```
4. **Remainder (CRC) = 101.** Polynomial check: x¹⁰ + x⁷ + x⁶ + x⁴ mod (x³ + x² + 1) = **x² + 1** ↔ 101 ✔.
5. **Transmitted message = 10011010 101**. Check: 10011010101 ÷ 1101 → remainder **000** ✔.

#### (b) The leftmost bit is inverted by noise. What is the result of the receiver's CRC calculation? How does the receiver know an error occurred? (6)
- Received: **0** 0011010101 = **00011010101**.
- The receiver divides by 1101. The leading zeros need no XOR; the first 1 is at position 4: 1101 ⊕ 1101 = 0000 → **00000000101**.
- **Remainder = 101 (≠ 000).**
- A correctly received frame is **exactly divisible by G** (remainder 0), because the sender made it so. A **non-zero remainder** therefore proves the frame was corrupted. The receiver **detects the error**, discards the frame and requests retransmission (ARQ). (This matches the worksheet's own example: *"Since the remainder is non-zero, we know that something went wrong!"* [ED].)

### Q3. Explain the three basic propagation mechanisms in a mobile communication system. (12)
*Identical to T1A Q1 (Part 5).*

### Q4. Differences between path loss, multipath propagation and interference. (12)
*Use T1A Q3 (Part 5): the Exam 1(a) paragraphs + table + the extra points. That gives 4 marks per impairment.*

### Q5. Discuss three methods to increase the capacity of a wireless communication system. (12)
Capacity = how many users or bits/s a system can carry in its spectrum. Three methods (4 marks each):

**1. Frequency reuse with smaller cells (network densification / SDMA)**
- Limit each transmitter's **range** and **reuse the same frequencies** in cells far enough apart that interference is acceptable. Traditional **macro cells** (km wide) are complemented by **small cells**: indoor **femtocells**, outdoor **picocells/relays**. Every reuse multiplies capacity, hence "network densification" [WC-B 5.4; WC-S 52].
- **SDMA/sectorization** strengthens this: directional antennas reduce co-channel interference, so the reuse pattern can be **tightened**. Moving from a **7-cell to a 4-cell pattern nearly doubles capacity**, and **intracell reuse** of the same channel by spatial separation becomes possible [MA p9–10].

**2. Multiple-antenna techniques (MIMO)**
- **SU-MIMO multilayer transmission** sends **parallel data streams** between one Tx–Rx pair, for a **higher data rate in the same bandwidth**.
- **MU-MIMO** forms **directional beams to several users simultaneously** (spatial multiple access), giving **more users per cell**.
- Diversity and beamforming improve link quality and coverage. 4×4 and 8×8 MIMO are in use; massive MIMO is coming [WC-B 5.4, Fig 5.9].

**3. Bandwidth expansion**
- **Carrier aggregation**: combine channels (802.11n/ac: 20 → 40/80/160 MHz; LTE aggregates carriers).
- **Millimetre-wave bands (30–300 GHz)**: much wider channels are available (at the cost of obstruction and absorption problems).
These are needed because Shannon limits the bps/Hz achievable for a given SNR [WC-B 5.4; WC-S 52].

*(Other valid choices: **efficient multiple access**: CDMA gives 4–5× the capacity of other digital systems [MA p8] and OFDMA allows tight subcarrier packing and opportunistic scheduling [OF]; **adaptive modulation and coding** [WC-S 51].)*

### Q6. Explain the spread spectrum principles of FHSS and DSSS. (10)
*Identical to T1A Q4 (Part 5).*

### Q7. Describe CDMA and explain why it is difficult to jam. (10)
*Expanded version of Exam Q1(d) for 10 marks:*

**Description (6 marks)**:
1. **Spread-spectrum multiple access**: all users **share the entire bandwidth all the time**; there are no separate frequencies or time slots [MA p7; MX].
2. **Unique pseudorandom (orthogonal) code per user**, shared by the mobile and the base station [MA p8].
3. **Spreading**: data are XORed/multiplied with the code at a much higher **chip rate**. E.g. IS-95: **1.2288 Mchip/s** spreading 13 kbps voice over **1.25 MHz**, with up to **64 codes/users** per channel [AT].
4. **Despreading**: the receiver's **correlator** uses the same code. Only the wanted signal is despread and passes the **narrowband filter**; other users' signals remain noise-like [MA p8].
5. **Power control**: all users transmit at the minimum required power, to limit mutual interference (the near-far problem) and save battery [MA p8].
6. **Advantages**: greatest spectrum efficiency (8–10× analogue, 4–5× other digital), **soft handoff**, simplified frequency planning, privacy (Walsh codes). Used in IS-95 and 3G [MA p8].

**Why it is difficult to jam (4 marks)**:
1. The signal occupies a **very wide band at a power density below the noise floor**. A jammer would need enormous power across the whole band.
2. **Processing gain**: despreading **spreads the jammer** over the wide band while concentrating the wanted signal. The narrowband filter then rejects most of the jamming energy (SUPPLEMENTARY: gain ≈ chip rate/bit rate, e.g. ≈ 21 dB for IS-95).
3. The jammer **doesn't know the pseudorandom code** (or hop sequence), so it cannot correlate with or mimic the signal. In FH, *"a malicious sender may jam one hopping period, but not the whole period"* [SS].
4. **Designed for anti-jamming**: spread spectrum's purposes include suppressing interference and making interception difficult [MA p7]. CDMA was a **military technology used in WWII to foil German jamming** [MX].

### Q8. Describe the difference between OFDM and OFDMA. (10)
**OFDM (4 marks)**: a **multicarrier modulation/transmission technique**. A high-rate stream (R bps) is split by a serial-to-parallel converter into **N lower-rate substreams (R/N)**, carried on **N orthogonal subcarriers** (spacing fb = a multiple of 1/T, e.g. 15 kHz in LTE). Orthogonality lets the spectra **overlap without interference** (≈ 6× more signals than FDM in the notes' example). Longer symbols (N·Ts) **defeat ISI** and **frequency-selective fading** hits only some subcarriers. **In OFDM all subcarriers carry the data of a single source** [OF §8.1].

**OFDMA (4 marks)**: a **multiple access scheme built on OFDM**: a combination of **FDMA and TDMA**, where **different users are assigned subsets of the subcarriers (subchannels / LTE resource blocks of 12 subcarriers) at different times**. Subchannels can be formed from **adjacent, regularly spaced or randomly spaced** subcarriers, and are allocated by **opportunistic scheduling** (efficiency, proportional fairness rᵢ/r̄ᵢ, requirements, priority). In the uplink, a user **concentrates power** on its own subchannels, saving battery [OF §8.2; AT].

**Key differences (2 marks)**:
| | OFDM | OFDMA |
|---|---|---|
| Type | Modulation / transmission technique | Multiple access technique |
| Users per symbol | One user uses all subcarriers | Many users share the subcarriers simultaneously |
| Multiple access | Needs another method (e.g. **CSMA** in 802.11, TDMA) | Built in (frequency + time) |
| Examples | 802.11a/g/n | **LTE downlink**, WiMAX |

*"Not all technologies that use OFDM use OFDMA. Some forms of 802.11 use OFDM for the signal but CSMA for multiple access"* [OF §8.2].

### Q9. What distinguishes single-user MIMO from multiple-user MIMO? (8)
**MIMO** uses multiple antennas at transmitter and receiver, for diversity, beamforming, multi-user MIMO and multilayer transmission [WC-B 5.4].

**SU-MIMO (4 marks)**: all spatial streams go between the base station/AP and **one user** at a time. **Multilayer transmission** sends **multiple parallel data streams** over the same frequency and time between that single Tx–Rx pair. **Goal: a higher data rate for that user in a given bandwidth.** The user device needs **multiple antennas** (number of streams ≤ min(Tx, Rx antennas)).

**MU-MIMO (4 marks)**: *"with enough MIMO antennas, directional antenna beams can be established to **multiple users simultaneously**"* [WC-B 5.4]. The BS **beamforms** separate streams to **different users** on the same time/frequency: **spatial division multiple access**. **Goal: higher system capacity, i.e. more users per cell.** Users can have single antennas, but the BS needs **many antennas** and **knowledge of each user's channel** to steer the beams and cancel inter-user interference.

**Summary**: SU-MIMO increases **one user's throughput**; MU-MIMO increases **the number of users served simultaneously**, i.e. cell capacity [WC-B Fig 5.9].

---

# TEST 2 2025 (T2-2025; 100 marks)

### Q1. State and explain the three categories of routing protocols in MANETs. (12)
*Use Exam Q2(d) (Part 5), with 4 marks per category.* For 12 marks, add to each category:
- **Proactive**: works like **distance-vector/link-state routing adapted to mobility**. DSDV adds **destination sequence numbers** to avoid loops and count-to-infinity, with full and incremental table dumps. **OLSR** uses multipoint relays to reduce flooding. **Best for** small networks with low mobility and frequent traffic.
- **Reactive**: **AODV**: RREQ broadcast → reverse path set up → RREP unicast back → forward route installed; **RERR** on link breaks; sequence numbers keep routes fresh [BT-S 87 for the outline]. **DSR**: the **whole source route** is carried in each packet; route caching. **Best for** large, highly mobile networks with occasional traffic.
- **Hybrid**: **ZRP**: each node has a **zone** (radius in hops). Intra-zone routing is proactive (IARP); inter-zone routing is reactive (IERP), querying only **border nodes** ("bordercasting"). Combines low latency nearby with low overhead far away.

### Q2. Dijkstra on Figure 1 from x to all nodes. (8)
| Step | N' | D(t),p | D(u),p | D(v),p | D(w),p | D(y),p | D(z),p |
|---|---|---|---|---|---|---|---|
| 0 | x | ∞ | ∞ | **3,x** | 6,x | 6,x | 8,x |
| 1 | xv | 7,v | **6,v** | — | 6,x | 6,x | 8,x |
| 2 | xvu | 7,v | — | — | **6,x** | 6,x | 8,x |
| 3 | xvuw | 7,v | — | — | — | **6,x** | 8,x |
| 4 | xvuwy | **7,v** | — | — | — | — | 8,x |
| 5 | xvuwyt | — | — | — | — | — | **8,x** |
| 6 | xvuwytz | — | — | — | — | — | — |

Updates: via v (3): t = 3 + 4 = 7; u = 3 + 3 = 6; w via v = 7 > 6 and y via v = 11 > 6 (no change). Ties at 6 (u, w, y) broken alphabetically. Via u: t via u = 8 > 7; w via u = 9 > 6. Via y: t = 13, z = 18 (no change).

| To | v | u | w | y | t | z |
|---|---|---|---|---|---|---|
| Cost | 3 | 6 | 6 | 6 | 7 | 8 |
| Path | x-v | x-v-u | x-w | x-y | x-v-t | x-z |
| First hop | v | v | w | y | v | z |

### Q3. What is the count-to-infinity problem in distance-vector routing? (5)
*Use the first paragraph of Exam Q3(d) (Part 5)*, plus the cause and the fix (5 marks):
- **Cause**: DV nodes know only their **neighbours' distance estimates**, not the paths behind them. After a link failure or cost increase, a node can adopt a neighbour's route that **goes back through itself**.
- **Effect**: a **routing loop**. Estimates rise by small steps with each exchange (**"bad news travels slowly"**), up to the true cost or to **infinity** if unreachable. Packets loop meanwhile. In the y/z/x example (4, 1, 50 → 60), it takes **44 iterations**.
- **Fixes**: **poisoned reverse** (advertise ∞ to the neighbour you route through), **split horizon**, a **maximum metric** (RIP: 16 = infinity).

### Q4. Explain the hidden terminal problem. Does it occur in Bluetooth? (10)
**Hidden terminal problem (6 marks)**: in a wireless LAN, station **B** is in range of both **A** and **C**, but **A and C cannot hear each other** (distance or an obstacle) [FZ Fig 15.3].
- A sends to B. C senses the medium, **hears nothing** and concludes it is idle, so it also transmits (to B). The two frames **collide at B**.
- Neither A nor C can **detect** the collision: wireless stations can't send and listen at once, and they can't hear each other anyway. So the whole frames are wasted, followed by ACK timeouts and retransmissions. **Capacity drops** [FZ].
- This is one of the three reasons **CSMA/CD can't be used** in wireless [WL 29].
- **Solution in 802.11**: the **RTS/CTS handshake**. The **CTS from B** (with the duration) reaches C, which sets its **NAV** and defers [FZ; WL 39, 43].

**In Bluetooth (4 marks)**: **No, not within a piconet.** Access is **centrally scheduled by the master** (FH-TDD-TDMA polling). A slave transmits **only in the slot immediately after the master addresses it**, and SCO slots are **reserved** [BT-B]. Since no device transmits on its own after sensing the channel, two hidden slaves can never start transmitting at the same time to the master. (Collisions between **different piconets** happen only when they hop to the same frequency in the same slot. That is a separate FH-CDMA effect handled by FEC/ARQ [BT-B].)

### Q5. Compare wired and wireless LANs. What unique concerns must the designer of a wireless LAN address? (10)
**Comparison (5 marks)**: use the wired-vs-wireless table in Part 3 §9.3 [FZ]. Medium (wires vs broadcast air); hosts (fixed attachment vs free movement); isolated LAN (switch vs ad hoc); connection to other networks (router vs AP gluing wireless to wired); moving between them (only NICs and switch↔AP change; MAC addresses change, IP addresses stay the same); access method (CSMA/CD vs CSMA/CA); characteristics (wireless adds attenuation, interference, multipath and a higher error rate). Also from [WL 3]: wireless gives flexibility, ad hoc operation and disaster robustness, but lower bandwidth, lower QoS and higher delay.

**Unique concerns (5 marks; 1 mark each, any five)**:
1. **Attenuation/path loss and coverage**: AP placement; more APs [WCP].
2. **Interference** in the crowded, unprotected **ISM band**: channel planning, 5 GHz [WL 23].
3. **Multipath and fading**: diversity, MIMO, OFDM, rate adaptation [WCP; WL 26].
4. **Higher error rates**: ACKs, retransmission, FEC, **fragmentation** [FZ; WL 27].
5. **Medium access without collision detection**: **hidden and exposed stations**, so CSMA/CA, RTS/CTS and NAV [FZ].
6. **Mobility/roaming** between BSSs and ESSs; association [FZ; WL 12].
7. **Power management** for battery devices [WL 4].
8. **Security and privacy** on a broadcast medium [WL 4, 27].
9. **Regulation**: licence-free but power-limited (≤ 1 W); national restrictions [WL 3, 23].
10. **QoS** for time-sensitive traffic: PCF, rate adaptation [WL 40].

### Q6. A wireless receiving site has occasional loss of signal due to interference. Discuss the steps you would take. (10)
*Identical to T1A Q12 (Part 5).*

### Q7. While Bluetooth's profiles add significant complexity, how can they benefit applications from the application's perspective? (10)
*Exam Q4(c) answer, expanded to 10 marks.* (2 marks per developed point.)
1. **Guaranteed interoperability between vendors**: the profile specification exists *"to define a standard of interoperability so that products from different vendors that claim to support a given usage model will work together"* [BT-B]. A user's headset, car kit or keyboard works with any phone or PC supporting the same profile.
2. **A complete recipe for each usage model**: a profile is *"a set of protocols that implement a particular Bluetooth-based application"*. It states which parts of the core specification are **mandatory, optional and not applicable** [BT-B]. Application developers don't have to interpret the 2500+ page core themselves; the design decisions are made for them.
3. **Reuse of existing protocols and other profiles**: profiles build on each other. E.g. the **File Transfer Profile depends on the Generic Object Exchange, Serial Port and Generic Access profiles**, using **OBEX** over **RFCOMM** and **L2CAP** [BT-B]. Developers reuse proven components rather than writing new ones.
4. **Smaller, cheaper, lower-power implementations**: a device implements **only the profiles it needs** (a mouse doesn't need file transfer), keeping Bluetooth's key attributes of **low cost and low power** [BT-B].
5. **Consistent behaviour and easy setup**: every device supports the **Generic Access Profile**, so discovery, connection and security work the same everywhere. With **SDP**, devices can query each other's services and connect automatically. This gives plug-and-play operation and simpler testing and certification [BT-B].

### Q8. Scatternet of 2 piconets, no CSMA, 80 frequencies: probability of collision? (10)
*Exam Q4(e) answer, written out in full for 10 marks:*

**Model and assumptions (3 marks)**:
- Each piconet's master sets a **pseudorandom hop sequence** from its own address, so the two piconets hop **independently** [BT-B].
- **80** equally likely frequencies; one hop per slot.
- Both piconets **always transmit** (always have packets), with **no carrier sensing**.
- A **collision** occurs when both use the **same frequency in the same slot**.
- A **successful transmission** = poll (master → slave) **and** reply (slave → master), so **2 slots on 2 different hops**.

**Calculation (5 marks)**:
1. P(same frequency in a given slot) = 80 × (1/80)(1/80) = **1/80 = 0.0125**
2. P(no collision in a slot) = 1 − 1/80 = **79/80 = 0.9875**
3. The two slots are independent, so P(poll AND reply both collision-free) = (79/80)² = **0.97516**
4. **P(collision during the transaction) = 1 − (79/80)² = 159/6400 ≈ 0.0248**

**Answer (2 marks)**: **about 2.5%** of poll/response transactions suffer a collision (1.25% for any single packet). Performance degrades as more piconets are added, as the notes say: *"as the number of piconets in an area increases, the number of collisions increases"* [BT-B]. SUPPLEMENTARY: with k other piconets, P(slot OK) = (79/80)ᵏ.

### Q9. A Bluetooth device can be in two piconets at the same time. Is there any reason one device cannot be the controller in both at the same time? (5)
*Identical to Exam Q4(d) (Part 5)*, plus one more mark: a device in two piconets must **time-share**. It follows one piconet's hop sequence and timing, then the other's. As master it would have to **impose its own hop sequence on both**, which would merge them into one.

### Q10. Two ISPs in a café. (i) Both on channel 11. (10) (ii) Channels 1 and 11. (10)
*Use Exam Q5(e) (Part 5), expanded:*
**(i) (10 marks)**
- **Does it break down?** No. 802.11's **CSMA/CA is distributed**: every station senses the channel before transmitting, whatever its ISP or AP. The two BSSs simply become **one shared collision domain** on channel 11 [WL 32–35].
- **Normal operation**: when a station of ISP 1 is transmitting, stations of ISP 2 that hear it (or its RTS/CTS) **defer**. Their **NAV** is set from the duration fields, so the channel is **time-shared** between the two BSSs. Each AP only processes frames carrying **its own BSSID**; the other ISP's frames are ignored after reception. The separate IP address blocks are irrelevant at the MAC layer.
- **Simultaneous transmission by two stations** (one per ISP): if both finish DIFS + backoff in the same slot, or they are **hidden** from each other, their frames **collide** at the receiving AP(s). With no collision detection, both frames are lost; **no ACK** returns; each station assumes a collision, **doubles its contention window**, picks a new random backoff and **retransmits** [WL 33, 35, 38].
- **Consequences**: more collisions, retransmissions and backoff delay; the channel's capacity is **shared**, so each ISP gets roughly **half the throughput**; **co-channel interference** raises the error rate [WL 12; WCP].

**(ii) (10 marks)**
- Channel 1 (2.412 GHz) and channel 11 (2.462 GHz) are **50 MHz apart**. Each ~22 MHz-wide signal [WC-S 4] does not overlap the other: they are **non-overlapping channels** (SUPPLEMENTARY).
- The two BSSs are now **independent collision domains**. A station's carrier sense on channel 1 does **not** detect transmissions on channel 11, and vice versa.
- **Two stations of different ISPs transmitting at the same time do not collide.** Both frames are received correctly by their own APs and ACKed.
- Each ISP gets the **full capacity** of its own channel, so aggregate throughput roughly **doubles**, with fewer collisions, backoffs and retransmissions and **no co-channel interference** between the networks.
- Stations of the same ISP still contend with each other as normal under CSMA/CA.

---

# COM5231 TEST 2 2026 (T2-2026; 50 marks)

### Q1. Distinguish between routing, packet forwarding and switching. For each, state its purpose and the information used to make its decision. (6)
*SUPPLEMENTARY (2 marks each).*
- **Routing**: **purpose**: determine the **end-to-end path** that packets take from source to destination across the network (a network-wide, control-plane function performed by routing algorithms such as Dijkstra/link-state and Bellman-Ford/distance-vector). **Information used**: the **network topology and link costs**, learned by exchanging routing messages with other routers. The output populates the **routing/forwarding table**.
- **Packet forwarding**: **purpose**: inside one router, **move each arriving packet from its input port to the correct output port/link** (a local, per-packet, data-plane action). **Information used**: the packet's **destination IP (network-layer) address**, looked up in the **forwarding table** (longest-prefix match).
- **Switching**: **purpose**: move **frames** to the correct outgoing port **within a LAN** at the link layer (also the term for transferring packets across a router's internal switching fabric). **Information used**: the frame's **destination MAC address**, looked up in the **switch table**, which the switch builds by **self-learning** from the source MAC addresses of arriving frames.

### Q2. Data byte 11001010; even-parity Hamming code; positions numbered from 1 at the left; check bits at 1, 2, 4, 8; data bits left to right in the remaining positions; no overall parity bit.
#### (a) Minimum number of check bits; show the inequality and verify. (2)
Inequality: **2^r ≥ m + r + 1**, with m = 8 data bits.
- r = 3: 2³ = 8 ≥ 8 + 3 + 1 = 12? **No**.
- r = 4: 2⁴ = 16 ≥ 8 + 4 + 1 = 13? **Yes**.
**Minimum r = 4** check bits, giving a 12-bit codeword.

#### (b) Data-bit placement and value of each check bit, with the positions covered. (4)
| Position | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Bit | P1 | P2 | **1** | P4 | **1** | **0** | **0** | P8 | **1** | **0** | **1** | **0** |

| Check bit | Positions covered | Data bits | Number of 1s | Even-parity value |
|---|---|---|---|---|
| **P1** | 1, 3, 5, 7, 9, 11 | 1, 1, 0, 1, 1 | 4 | **0** |
| **P2** | 2, 3, 6, 7, 10, 11 | 1, 0, 0, 0, 1 | 2 | **0** |
| **P4** | 4, 5, 6, 7, 12 | 1, 0, 0, 0 | 1 | **1** |
| **P8** | 8, 9, 10, 11, 12 | 1, 0, 1, 0 | 2 | **0** |

#### (c) Complete transmitted codeword (positions 1 → 12). (2)
**0 0 1 1 1 0 0 0 1 0 1 0 → 001110001010**

### Q3. CRC: data 110101, generator 1011 (G(x) = x³ + x + 1), modulo-2 division.
#### (a) Number of zeros appended and the resulting bit string. (1)
Degree 3 → **append 3 zeros** → **110101000**.

#### (b) Show the division and the CRC remainder. (3)
| Step | Window | ⊕ 1011 | Result | Working value |
|---|---|---|---|---|
| 1 | 1101 | 1011 | 0110 | 011001000 |
| 2 | 1100 | 1011 | 0111 | 001111000 |
| 3 | 1111 | 1011 | 0100 | 000100000 |
| 4 | 1000 | 1011 | 0011 | 000001100 |
| 5 | 1100 | 1011 | 0111 | 000000111 |

```
110101000
1011
----
 1100
 1011
 ----
  1111
  1011
  ----
   1000
   1011
   ----
     1100
     1011
     ----
      111   ← remainder
```
**CRC remainder = 111.**

#### (c) Complete transmitted bit string. (2)
**110101111** (data 110101 followed by CRC 111). Check: 110101111 ÷ 1011 → remainder 000 ✔.

### Q4. Simplified Internet checksum, 4-bit words. Message 1010 1100 0110 1001; one's-complement addition with end-around carry.
#### (a) Show the addition and calculate the checksum. (3)
| Step | Addition | Raw result | End-around carry | Running sum |
|---|---|---|---|---|
| 1 | 1010 + 1100 | 1 0110 | 0110 + 1 | **0111** |
| 2 | 0111 + 0110 | 1101 | none | **1101** |
| 3 | 1101 + 1001 | 1 0110 | 0110 + 1 | **0111** |

**Sum = 0111. Checksum = one's complement = 1000.**
(Decimal check: 10 + 12 + 6 + 9 = 37; mod 15 → 7 = 0111 ✔.)

#### (b) 4-bit result expected when the receiver adds all message words and the checksum, assuming no error. (1)
0111 + 1000 = **1111** (all ones; complementing it gives 0000, meaning no error detected).

### Q5. Define a single-bit error and a burst error. Explain how the length of a burst error is measured. (3)
- **Single-bit error**: only **one bit** of the data unit changes (0 → 1 or 1 → 0). (1)
- **Burst error**: **two or more bits** in the data unit change (not necessarily consecutive). (1)
- **Burst length**: measured from the **first corrupted bit to the last corrupted bit, inclusive**. Bits between them may or may not be corrupted. E.g. errors at bit positions 3 and 6 → burst length 6 − 3 + 1 = **4**. (1)

### Q6. Even-parity scheme with one parity bit per block. Is it guaranteed to detect each of the following? Justify.
#### (a) A single-bit error. (2)
**Yes, always.** Even parity makes the number of 1s even. Flipping **one** bit changes the count by exactly one, making it **odd**, so the receiver's check fails and the error is detected.

#### (b) A burst error. (2)
**No, not guaranteed.** Parity detects only an **odd** number of bit errors. A burst that flips an **even** number of bits (2, 4, …) leaves the count of 1s even, so the block **passes** undetected. E.g. 1011 0010 → 1**10**1 0010: two errors, still four 1s. A burst is detected only if it happens to flip an odd number of bits.

#### (c) Can a single parity bit identify and correct the erroneous bit? (1)
**No.** It only shows that **an odd number of bits** changed, not **which** bit. Correction needs more redundancy (e.g. Hamming code or 2-D parity) or retransmission.

### Q7. Bluetooth profiles add complexity. Explain two ways in which profiles benefit application developers or users. (4)
1. **Interoperability (users)** (2): profiles define a *"standard of interoperability so that products from different vendors that claim to support a given usage model will work together"* [BT-B]. A user can pair any compliant headset, car kit or keyboard with any phone without compatibility worries.
2. **Ready-made, reusable implementation (developers)** (2): a profile specifies **exactly which protocols and features are mandatory, optional or not applicable** for a usage model, and builds on other profiles. E.g. the File Transfer Profile reuses OBEX, RFCOMM, L2CAP and the Generic Access Profile [BT-B]. Developers implement a known recipe (and only the subset they need), which saves effort and keeps devices small, cheap and low-power.

### Q8. Compare the Bluetooth Classic central (master) with an access point in an 802.11 infrastructure WLAN. Explain one difference in medium-access coordination and one in their roles in connecting devices to other networks. (4)
- **Medium-access coordination (2)**: the **Bluetooth central schedules all access**. It defines the hop sequence and timing, and **polls** slaves, who may transmit **only in the slot after being addressed** (FH-TDD-TDMA), so there is **no contention or collision inside the piconet** [BT-B]. In **802.11**, stations **contend using CSMA/CA (DCF)**: sense, DIFS, random backoff, RTS/CTS, NAV. **Collisions are possible**, and the AP does not normally schedule access (polling via PCF is optional) [WL 32–40].
- **Connecting to other networks (2)**: the **802.11 AP is a bridge/portal**: it *"provides a link to other networks and acts as a relay point for all MAC frames"*, connecting the BSS to the wired distribution system/Internet [BT-S 64; FZ]. The **Bluetooth central only sets up the piconet and relays traffic within it** [BT-S 64]. Slaves can reach other piconets only via **scatternet bridge devices**, and a piconet is a short-range PAN, not an infrastructure gateway.

### Q9. Dijkstra's shortest-path algorithm on the given network.
**Link costs read from the figure**: A–B 2, A–G 6, B–C 7, B–E 2, E–G 1, E–F 2, F–C 3, F–H 2, G–H 4, C–D 3, H–D 2.

#### (a) Shortest path from A to all nodes (step by step). (6)
| Step | N' | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|---|
| 0 | A | **2,A** | ∞ | ∞ | ∞ | ∞ | 6,A | ∞ |
| 1 | AB | — | 9,B | ∞ | **4,B** | ∞ | 6,A | ∞ |
| 2 | ABE | — | 9,B | ∞ | — | 6,E | **5,E** | ∞ |
| 3 | ABEG | — | 9,B | ∞ | — | **6,E** | — | 9,G |
| 4 | ABEGF | — | 9,B | ∞ | — | — | — | **8,F** |
| 5 | ABEGFH | — | **9,B** | 10,H | — | — | — | — |
| 6 | ABEGFHC | — | — | **10,H** | — | — | — | — |
| 7 | ABEGFHCD | — | — | — | — | — | — | — |

Working:
- Step 0: A's neighbours are B 2 and G 6. Smallest = **B**.
- Step 1: via B (2): C = 2 + 7 = 9; E = 2 + 2 = 4. Smallest = **E (4)**.
- Step 2: via E (4): G = 4 + 1 = **5** (< 6, update); F = 4 + 2 = 6. Smallest = **G (5)**.
- Step 3: via G (5): H = 5 + 4 = 9. Smallest = **F (6)**.
- Step 4: via F (6): C = 6 + 3 = 9 (equal to 9, keep B); H = 6 + 2 = **8** (< 9, update). Smallest = **H (8)**.
- Step 5: via H (8): D = 8 + 2 = 10. Smallest = **C (9)**.
- Step 6: via C (9): D = 9 + 3 = 12 > 10 (no change). Smallest = **D (10)**. Done.

#### (b) Final shortest-path cost and complete route from A to B, C, D, E and F. (4)
| Destination | Cost | Route |
|---|---|---|
| B | **2** | A → B |
| C | **9** | A → B → C *(equal-cost alternative A → B → E → F → C = 9)* |
| D | **10** | A → B → E → F → H → D |
| E | **4** | A → B → E |
| F | **6** | A → B → E → F |
*(Also: G = 5 via A → B → E → G; H = 8 via A → B → E → F → H.)*

---

# BLUETOOTH EXERCISES (20 questions) [BTX]

**1. Why is Bluetooth called a WPAN, not a WLAN?** Its range is ~**10 m** (a person's personal space), it targets **low power, low cost cable replacement** between a user's own devices, and a piconet holds only **8 active devices**. A WLAN covers a building or campus, serves many users and connects to wider networks [BT-B; BT-S 56].

**2. Alternate name for Bluetooth Smart, and which version?** **Bluetooth Low Energy (BLE)**, introduced in **Bluetooth 4.0** [BT-S 53].

**3. How does Bluetooth 3.0 reach 24 Mbps?** By the **Alternative MAC/PHY (AMP)**: Bluetooth 3.0 + HS uses a co-located **802.11 (Wi-Fi) link** for high-rate data. The Bluetooth radio still does discovery, association, connection setup, profile configuration and maintenance; a **Protocol Adaptation Layer (PAL)** maps Bluetooth protocols onto the 802.11 MAC/PHY [BT-S 52; BT-B].

**4. Compare a piconet and a scatternet.** **Piconet**: the basic unit, **1 master + up to 7 active slaves**, sharing **one hopping sequence** set by the master; slaves talk only to the master. **Scatternet**: **two or more overlapping piconets** linked by devices that belong to more than one (as slave in both, or master in one and slave in the other). **The piconet shares the logical channel and data transfer; the scatternet shares the physical area and total bandwidth** (FH-CDMA) [BT-B].

**5. Can a piconet have more than eight stations?** **Not more than eight active ones**: 1 master + **7 active slaves**, because the **AM_ADDR** field is **3 bits** (8 values, with 0 reserved for broadcast) [BT-S header]. SUPPLEMENTARY: more devices can be **parked** (synchronised but inactive) and swapped in.

**6. Relationship between master and slave?** The **master determines the hopping sequence (channel) and phase (timing)** from its own address. **Slaves tune to it**, may **communicate only with the master**, and **only when granted permission** (polled) [BT-B].

**7. Types of links between master and slave.** **SCO** (synchronous connection-oriented: reserved symmetric slots, fixed bandwidth, **no retransmission**, used for voice); **eSCO** (extended SCO: reserved slots, **asymmetric** allowed, **retransmission** supported); **ACL** (asynchronous connectionless: **point-to-multipoint**, packet-switched, uses unreserved slots, **retransmission**, polled) [BT-B].

**8. Master vs base station in 802.11.** See Exam Q4(a) (Part 5) and T2-2026 Q8.

**9. Can one device be controller of two piconets?** No. See Exam Q4(d) (Part 5).

**10. Role of the radio layer?** It specifies the **air interface**: the 2.4 GHz ISM band, **79 × 1 MHz channels**, **frequency hopping**, **GFSK** (π/4-DQPSK/8DPSK for EDR) modulation, and **transmit power classes 1–3** [BT-B].

**11. Actual bandwidth used?** At any instant a piconet uses **1 MHz** (one hop channel). Over time it hops across the **79 MHz (≈ 80 MHz)** band, so the total spread bandwidth is ~79 MHz [BT-B].

**12. Spread spectrum technique?** **Frequency hopping spread spectrum (FHSS)**, **1600 hops/s** (0.625 ms slots), with optional **adaptive frequency hopping** [BT-B].

**13. Modulation technique in the radio layer?** **Gaussian frequency-shift keying (GFSK)**: binary 1 = **positive** frequency deviation, 0 = **negative** deviation from the carrier; 1 Msymbol/s × 1 bit = **1 Mbps**. EDR uses **π/4-DQPSK (2 bits/symbol, 2 Mbps)** and **8DPSK (3 bits/symbol, 3 Mbps)** [BT-B].

**14. How can FH and TDD be combined?** Each **625 µs slot** uses the **next frequency** in the hop sequence (FH), **and** the direction alternates between slots: master → slave, then slave → master (TDD). Multislot packets (3 or 5 slots) stay on one frequency, then jump to the frequency the sequence requires. This gives FH-TDD-TDMA [BT-B Fig 12.4–12.5].

**15. How does FH-CDMA differ from DS-CDMA?** **FH-CDMA**: users are separated by **different hopping sequences**. Each uses a narrow channel at a time, and collisions happen only when two users land on the same frequency in the same slot (Bluetooth scatternets). **DS-CDMA**: all users transmit **simultaneously over the whole wide band**, spread by **different chip codes**, and separated by **correlation** at the receiver (IS-95, WCDMA) [BT-B; MA; AT].

**16. Do Bluetooth devices and microwave ovens interfere?** **Yes, they can.** Microwave ovens radiate around **2.45 GHz**, inside Bluetooth's 2.4 GHz ISM band [WCP §10]. The effect is **limited**: Bluetooth hops over 79 channels 1600 times/s, so only hops near the oven's frequency suffer, **adaptive frequency hopping** can avoid bad channels, and lost packets are recovered by **FEC/ARQ** [BT-B].

**17. MAC protocol in the baseband?** **TDMA with master-controlled polling over FH and TDD (FH-TDD-TDMA)**. There is no contention within a piconet; slaves transmit only when addressed [BT-B].

**18. Role of L2CAP?** It **adapts upper-layer protocols to the baseband**, providing **connectionless and connection-oriented** services. SUPPLEMENTARY detail: protocol multiplexing, segmentation and reassembly of large packets, and QoS [BT-B].

**19. How are profiles an advantage to applications?** See Exam Q4(c) and T2-2025 Q7.

**20. Scatternet collision probability.** See Exam Q4(e) and T2-2025 Q8: **≈ 1 − (79/80)² ≈ 2.5%**.

---

# ERROR-DETECTION WORKSHEET EXERCISES [ED]

**W1. Message 11001001, CRC x³ + 1 (1001).** Remainder **011** → transmit **11001001011**. Leftmost bit flipped → received 01001001011 → remainder **010** → non-zero → error detected. *(Worked in the worksheet; verified correct.)*

**W2. CRC-8 (x⁸ + x² + x + 1 = 100000111) on 1011 0011 0101 0110.** Remainder **11010101** → transmit **1011 0011 0101 0110 1101 0101**. **7th bit flipped** → remainder **00101010** (101010) → error detected. *(Worksheet values verified.)*

**W3. G = 10011, D = 1010101010: R?** **R = 0100.** (a) 1000100101 → **1000**; (b) 0101101010 → **1111**; (c) 0110100011 → **1110**. *(Full division in Part 2, §8.8 CR5.)*

**W4. Internet checksum of 1001 1100 1010 0011 (4-bit).** **1011**. (Exam Q2(c).)

**W5. Hamming for 10101111: check bits and codeword.** **4 check bits; codeword 101001001111.** (Exam Q2(a).)

**W6. M(x) = 110001110110, G(x) = x⁵ + x² + x + 1: frame T(x)? Why modulo-2?**
G = **100111**, append 5 zeros, remainder **10101** → **T(x) = 110001110110 10101**. *(Division in Part 2, §8.8 CR6.)*
**Why modulo-2**: addition and subtraction become the **same XOR operation with no carries or borrows**. That makes CRC computation trivial in hardware (**shift register + XOR gates**) and corresponds to **polynomial arithmetic over GF(2)**, which gives CRC its guaranteed detection properties.

**W7. Single-bit vs burst errors and parity.** See T1B Q1.
