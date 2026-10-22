# About These Answers

These are model answers for the five pages you photographed, **in the same order as your photos**:
1. **COM5231 Test 2 2026** (50 marks)
2. **Test 1** (version A, 14 questions)
3. **COM5231 Test 1** (version B, 9 questions)
4. **Test 2 2025** (100 marks)
5. **Exam paper, page 4**: Question 4(e) and Question 5

Every answer is written out in full, so nothing refers you to another page. Marks are shown in brackets, and answer length follows the marks.

- Sources from your notes are in square brackets: [WC] wireless channel, [WCP] wireless problems, [MA] multiple access, [MX] multiplexing, [AT] access-technologies article, [SS] spread spectrum, [OF] OFDM, [ED] error worksheet, [WL] WLAN slides, [FZ] Forouzan WLAN chapter, [BT-B]/[BT-S] Bluetooth book/slides.
- **Routing answers (Test 2 2026 Q1 and Q9; Test 2 2025 Q1–Q3) are SUPPLEMENTARY.** Your notes don't cover routing, so these follow the standard textbook method.
- No memos were provided. These are **model answers**, not the lecturer's marking guide. Every calculation has been checked by computer.

# COM5231 Test 2 2026 (50 marks)

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

# Test 1 — Version A (14 questions)

### Q1. Explain the three basic propagation mechanisms in a mobile communication system. (12)

In a mobile system, the receiver often has **no clear line of sight** to the base station. The signal still arrives because of three mechanisms, which also cause **multipath** [WC-B 5.3, Fig 5.5]:

**1. Reflection (4 marks)**: occurs when the EM wave meets a surface that is **large compared with its wavelength**, e.g. the ground, walls, buildings and furniture [WCP]. Part of the energy bounces off. In a mobile system the **ground-reflected wave** and the line-of-sight wave can **cancel each other**, causing high signal loss. Because the mobile antenna is lower than most buildings, many reflected waves arrive, and they combine **constructively or destructively** at the receiver. Reflection is the most significant effect even when LOS exists.

**2. Diffraction (4 marks)**: occurs at the **edge of an impenetrable body that is large compared with the wavelength** (a sharp edge such as a building corner or rooftop). The edge acts as a **new source**: **secondary waves** spread out in different directions, including **into the shadow behind the obstacle**. Signals can therefore be received **even when there is no unobstructed LOS** from the transmitter [WC-B 5.3; WCP].

**3. Scattering (4 marks)**: occurs when the obstacle is **on the order of the wavelength or smaller** and there are **many such objects**: lamp posts, traffic signs, foliage, rough surfaces. The incoming signal is **scattered into many weaker outgoing signals** in all directions. At cellular frequencies such objects are everywhere, so **scattering is hard to predict** [WC-B 5.3].

**Overall effect**: with a clear LOS, diffraction and scattering are minor and reflection matters most. With **no LOS** (e.g. at street level in a city), **diffraction and scattering are the primary means of reception**. Together the three produce **multipath**: several delayed copies that cause **fading and ISI** [WC-B 5.3].

### Q2. What are the main problems of signal propagation? Why do radio waves not always follow a straight line? Why is reflection both useful and harmful? (12)

**Main problems (6 marks)** [WC-S 18, 39; WCP §2.3; WC-B 5.2–5.3]:
1. **Attenuation / path loss / free-space loss**: power falls with distance (∝ d²) and is greater at higher frequencies.
2. **Noise**: thermal (cannot be eliminated), intermodulation, crosstalk, impulse noise (the main source of digital errors).
3. **Atmospheric absorption**: water vapour and oxygen attenuate the signal.
4. **Multipath propagation**: reflection, diffraction and scattering create delayed copies.
5. **Fading**: fast/slow and flat/frequency-selective variation in received power; shadowing.
6. **Intersymbol interference**: delayed copies overlap the next symbols.
7. **Refraction**: bending of the wave.
8. **Interference** from other transmitters (co-channel, adjacent-channel), plus the shared medium and a higher BER.

**Why waves don't always travel in straight lines (3 marks)**:
- **Refraction**: wave speed depends on the **density of the medium**, so at the boundary between media (or through the varying atmosphere) the wave **bends**. Sky waves (3–30 MHz) are **refracted by the ionosphere** back to Earth [WC-S 15, 19].
- **Ground waves** (below ~3 MHz) **follow the curvature of the Earth** [WC-S 14].
- **Reflection, diffraction and scattering** redirect the wave around and off obstacles [WC-B 5.3].

**Reflection: useful and harmful (3 marks)**:
- **Useful**: reflected waves let the signal **reach receivers with no line of sight** (indoors, behind buildings, in streets). The extra copies can be **combined by diversity/MIMO** receivers to strengthen the signal [WC-B 5.3–5.4].
- **Harmful**: reflected copies arrive with **different delays and phases**, so they can **cancel** the direct signal (the ground reflection vs LOS), causing **fading** (20–30 dB dips), **distortion** and **intersymbol interference**, which raises the bit error rate [WC-B 5.3].

### Q3. Differences between path loss, multipath propagation and interference from other sources. (9)

**Path loss** is the **reduction in signal power** as the signal travels from transmitter to receiver. In free space it happens because energy **spreads over an ever-larger sphere**, so Pt/Pr = (4πd/λ)²: loss grows with the **square of distance and of frequency**. Real environments add obstruction and absorption, described by the **path-loss exponent** n (2 in free space, 2.7–3.5 urban, 4–6 obstructed indoors). Path loss is **predictable and deterministic**. It sets the transmit power, receiver sensitivity and SNR needed, and it is countered by **higher power, better antennas or more access points** [WC-B 5.2; WC-S 30–34; WCP §9].

**Multipath propagation** happens when **reflection, diffraction and scattering** from buildings, walls, the ground and small objects make **several copies of the same signal arrive with different delays and phases**. The copies add **constructively or destructively**, causing **fading** (drops of 20–30 dB over half a wavelength) and **intersymbol interference**. It **varies randomly with time and position** as the user moves, and gives "high signal strength but poor quality". It is countered by **equalization, diversity/MIMO, OFDM and spread spectrum** [WC-B 5.3; WCP §7].

**Interference from other sources** is caused by **other transmitters**, not the wanted signal's path. Examples are **co-channel** interference (other WLANs on the same channel, microwave ovens at 2.4 GHz), **adjacent-channel** interference, harmonics and atmospheric noise. It **depends on other users' activity**, lowers the SINR, and causes **bit errors and blocked transmissions**. It is countered by **channel/frequency planning, spread spectrum, directional antennas and removing the source** [WCP §10; WC-S 10].

| | Path loss | Multipath | Interference |
|---|---|---|---|
| Cause | Distance/frequency spreading | Reflection, diffraction, scattering of **own** signal | **Other** transmitters |
| Behaviour | Deterministic, smooth | Random, time-varying (fading, ISI) | Random/bursty, depends on others |
| Fix | Power, antennas, more APs | Equalization, diversity, OFDM | Channel planning, spread spectrum |

**Additional points for full marks:**

- **Path loss**: example: indoors it increases ~**20 dB per 100 ft**; the main countermeasure is **additional access points** [WCP §9]. Expressed as Lp = (4πd/λ)² = Pt/Pr.
- **Multipath**: it is especially severe **indoors**; vendors use **equalization and antenna diversity** and may need **lower data rates** [WCP §7]. It produces **Doppler** effects when the receiver moves.
- **Interference**: two directions: **inward** (co-channel, from other systems on similar frequencies, e.g. microwave ovens at 2.4 GHz) and **outward** (adjacent-channel: your WLAN disrupting others, e.g. aircraft navigation). It is uncommon in spread-spectrum WLAN bands because power is low (< 1 W), so devices must be close and in the same band [WCP §10].

### Q4. Explain the spread spectrum principles of (i) FHSS and (ii) DSSS. (10)

**General principle (2 marks)**: spread spectrum is designed for wireless, where stations share the air and need protection from **eavesdropping and jamming**. It adds **redundancy** by expanding bandwidth **B to Bss ≫ B**. Two principles: (1) the allocated bandwidth is **much larger than needed**; (2) the spreading is done **after** the signal is created, by a process **independent of the signal**, using a **spreading code** that looks random but is a pattern [SS].

**(i) FHSS (4 marks)**:
- Uses **M carrier frequencies**. At each moment the source modulates **one carrier**, and the next moment another.
- A **pseudorandom code generator** produces a **k-bit pattern each hopping period Th** (M = 2ᵏ); a **frequency table** maps it to a frequency; a **frequency synthesizer** generates it; the **modulator** applies the data.
- *Example*: M = 8, k = 3; the pattern 101, 111, 001, … selects 700 kHz, 900 kHz, 300 kHz, … and repeats after 8 hops.
- **Privacy**: an intruder can only capture a **small piece** without the sequence. **Anti-jamming**: a jammer can hit **one hop, not the whole transmission**. **Sharing**: M stations can share Bss, like FDM with the allocation changing every hop [SS].

**(ii) DSSS (4 marks)**:
- **Each data bit is replaced by n bits called chips**, using a spreading code. The **chip rate is n times the bit rate**, so the bandwidth grows n times.
- *Example*: the **Barker sequence** (n = 11, **10110111000**) used in wireless LANs. With polar NRZ, the spread signal = data × chips (a 1 sends the code, a 0 sends its inverse). The required bandwidth is **11×** the original.
- **Privacy** if the intruder doesn't know the code; **immunity to interference** if each station uses a different code. Bandwidth can be **shared** only if special (orthogonal) codes are used, i.e. **CDMA** [SS].

### Q5. Benefits of the OFDMA approaches: adjacent, regularly spaced, randomly spaced subcarriers. (9)

In OFDMA, subcarriers are grouped into **subchannels** that are allocated to users. The three ways of forming subchannels each have benefits [OF §8.2]:

**(i) Adjacent subcarriers** (a contiguous block): all subcarriers in the block have **about the same SINR**. This creates an **opportunity**: the system can **choose, from many possible blocks, the best block for each user**, optimising **channel efficiency, user requirements, priority and fairness**. It exploits frequency-selective fading for multi-user gain. (The cost is that it needs accurate, up-to-date **channel knowledge across the whole bandwidth**, via pilots and prediction; used by LTE and WiMAX.)

**(ii) Regularly spaced subcarriers** ("distributed"/"comb"): spreading a user's subcarriers across the band gives **frequency diversity**, so **enough good subcarriers are obtained whichever are chosen**, even in frequency-selective fading. The **channel-estimation burden is much lower** (used by LTE).

**(iii) Randomly spaced subcarriers**: the **same frequency-diversity benefit** as regular spacing, **plus reduced adjacent-cell interference**, because neighbouring cells' random patterns rarely coincide (used by WiMAX).

**Additional detail:**

- **Adjacent**: all SINRs are about equal, so whole blocks can be compared. The scheduler can pick **each user's best block** (optimising efficiency, requirements, priority, fairness). It requires **pilot symbols, channel knowledge across the full band, and prediction**, because information may be out of date. Used by **LTE and WiMAX** [OF].
- **Regularly spaced**: "distributed"/"comb"; **frequency diversity**, so there are enough good subcarriers **regardless of which are chosen**; **low channel-estimation burden**. Used by **LTE**.
- **Randomly spaced**: the **diversity benefits** of regular spacing **plus reduced adjacent-cell interference**. Used by **WiMAX**.

### Q6. Describe CDMA and explain why it is difficult to jam. (4)

**CDMA** lets **all users transmit over the entire bandwidth at the same time**. Each user is separated by a **unique pseudorandom (orthogonal) code** that **spreads** its baseband data at a much higher **chip rate**. The spread signal is transmitted **below the noise level**. The receiver uses a **correlator with the same code to despread** the wanted signal, which then passes a narrowband filter. Other users' signals are **not despread** and remain low-level noise. **Precise power control** keeps every transmitter at the minimum power [MA p7–8].

**Difficult to jam because**:
1. The energy is **spread over a very wide band at very low power density**, so a jammer must cover the whole band to have an effect.
2. **Despreading spreads the jammer**: the correlator collapses the wanted signal back to narrowband but **spreads the jamming signal** (it doesn't carry the user's code), and the **narrowband filter removes most of it**.
3. The **pseudorandom code is unknown** to the jammer, so it cannot concentrate its energy where the signal is.

That is why spread-spectrum CDMA was used in **WWII to foil enemy jamming** [MX], and why its stated uses include **suppressing interference and making interception difficult** [MA p7].

### Q7. As a mobile node gets farther from a base station, what two actions could the BS take so that the frame loss probability does not increase? (4)

1. **Increase transmit power** (2 marks): received power falls as **1/d²** (Pr = Pt/(4πd/λ)²). Raising Pt keeps Pr and the SNR above the receiver's required threshold [WCP Eq 2.1–2.2].
2. **Lower the data rate / use more robust modulation and coding** (2 marks): with **adaptive modulation and coding** (802.11 **rate adaptation**), the BS switches to a lower-order modulation and stronger FEC, which need a **lower SNR for the same bit error rate** [WC-S 51; WL 23].
(Also acceptable: **beamforming** a directional beam toward the node [WC-B 5.4].)

### Q8. Use Figure 2 to explain the hidden node problem. What happens when A and C send simultaneously? (4)

In Figure 2, **B is within range of both A and C, but A and C are outside each other's range**. When A transmits to B, **C cannot hear A**, so C's carrier sense finds the channel idle. A and C are **hidden from each other with respect to B** [FZ].
**If A and C send at the same time** (e.g. both to B): both sense an idle medium and transmit. Their signals **overlap at B, so B receives a collision** and can decode neither frame. Since wireless stations **cannot detect collisions**, A and C keep sending their **whole frames**, wasting the channel. Neither receives an **ACK**, so both time out, **back off a random time and retransmit**. Hidden nodes therefore **reduce network capacity** [FZ; WL 29].

### Q9. Use Figure 2 to explain how CSMA/CA is realised in 802.11 (A sends). (4)

1. **Carrier sense**: A checks its **NAV** and senses the medium. When idle, it waits **DIFS**, then counts down a **random backoff** (the counter freezes if the medium becomes busy) [WL 32–35].
2. **RTS**: A sends an RTS containing the **duration** of the whole exchange. B hears it (C doesn't).
3. **CTS**: after **SIFS**, B replies with a CTS that also carries the duration. **C is in B's range, so it hears the CTS, sets its NAV and defers**, even though it can't hear A. This is how the hidden node is handled [FZ; WL 39, 43].
4. **DATA and ACK**: after SIFS, A sends the data. After SIFS, B returns an **ACK**. If A gets no CTS or no ACK, it assumes a collision, backs off and retries [WL 35, 38].

### Q10. Why are acknowledgements used in 802.11 but not in wired Ethernet? (4)

1. **No collision detection in wireless**: a station can't transmit and receive at the same time (the received signal is far weaker; it would need costly full-duplex hardware) [WL 16, 29].
2. **Hidden stations**: even if it could listen, a collision at the receiver may be **inaudible to the sender** [FZ].
3. **High error rate**: noise, interference, fading and multipath corrupt many frames, so the MAC and PHY are **unreliable** [WL 27].
4. **In Ethernet**, a **detected** collision triggers a resend and **no collision acts as an implicit acknowledgement**, on a low-error cable [FZ].
So 802.11 uses **explicit ACKs after SIFS**, and retransmits when no ACK arrives [WL 27, 34].

### Q11. Two ISPs in a café. (i) Both on channel 11. (4) (ii) Channels 1 and 11. (4)

#### (i) By accident both APs use channel 11. Will 802.11 completely break down? What happens when two stations, each associated with a different ISP, transmit at the same time? (4)
**No, it does not break down.** The two BSSs simply **share one channel as a single collision domain**. Every station still runs **CSMA/CA**: it senses the channel and its NAV, so stations from **both** ISPs **defer to each other** and take turns, as if they were one bigger BSS. (The different IP blocks don't matter at the MAC layer; each AP only accepts frames addressed to its own BSS.)
If two stations from different ISPs **transmit at the same moment** (e.g. their backoff counters expire together, or they are hidden from each other), their frames **collide**. Neither AP receives a correct frame, **no ACKs are returned**, both stations **back off a random time** (with a larger contention window) and **retransmit**. The result is **more collisions and lower throughput for both ISPs** (each gets roughly half the channel capacity), but the network keeps working.

#### (ii) Now one AP uses channel 1 and the other channel 11. How do the answers change? (4)
Channels **1 and 11 do not overlap** (in the 2.4 GHz band, signals are ~22 MHz wide [WC-S 4] and channels are 5 MHz apart, so 1 and 11 are 50 MHz apart; SUPPLEMENTARY). The two BSSs now form **two independent collision domains**:
- Stations of different ISPs **don't hear each other's transmissions** in carrier sense, so they **don't defer to each other**.
- **Two stations can transmit at the same time without colliding**: each frame reaches its own AP successfully and is ACKed.
- **Each ISP gets the full capacity of its own channel**: aggregate throughput roughly **doubles**, with fewer collisions and backoffs.

### Q12. A wireless receiving site is experiencing occasional loss of signal due to interference. Discuss the steps you would take to correct this problem. (10)

A systematic approach (about 1 mark per explained step) [WCP §9–10; WC-S 9–10; WL 12, 21–23; WC-B 5.4]:
1. **Characterise the problem**: record **when** it happens (time of day, which events), **where** (which areas), and **which channels/frequencies**. "Occasional" loss suggests an **intermittent source**, e.g. a **microwave oven at 2.4 GHz** or a neighbouring network's bursts.
2. **Survey the spectrum**: use a **spectrum analyser / WLAN site-survey tool** to identify interfering signals and **co-channel or adjacent-channel** networks. Decide whether it is **inward** interference (others → us) or something we cause (outward).
3. **Identify and locate the source**: microwave ovens, cordless phones, Bluetooth devices, neighbouring APs, other ISM equipment, faulty electrical equipment (impulse noise).
4. **Remove, switch off, shield or relocate** the interfering device, or **increase the separation** between it and the receiver. Interference needs the devices to be **close and in the same band** [WCP §10].
5. **Change channel**: move the AP/link to a **clear, non-overlapping channel** (e.g. 1, 6 or 11 in 2.4 GHz), or move to the **less crowded 5 GHz band** [WL 23].
6. **Improve the antenna system**: reposition/raise the antenna to restore LOS; use **directional antennas** that point at the wanted transmitter and **reject** interference from other directions; use **antenna/space diversity** [WC-B 5.4].
7. **Improve the link margin**: increase the **wanted signal's power or antenna gain** within regulatory limits, so the **SINR** stays above threshold during interference bursts.
8. **Use robust transmission techniques**: **spread spectrum / (adaptive) frequency hopping**, **FEC**, **adaptive modulation and coding / lower data rates**, and ARQ to ride out bursts [WC-B 5.4].
9. **Network design**: add APs or reduce cell size; coordinate channel and power plans with neighbouring networks.
10. **Verify and monitor**: re-test after each change, and keep monitoring to confirm the problem has gone.

### Q13. Explain why many WiFi networks can have a high error rate caused by co-channel interference. (4)

1. **Few clean channels**: 2.4 GHz has only **three non-overlapping channels** (1, 6, 11; SUPPLEMENTARY), and the **AP administrator chooses the channel**, so *"interference [is] possible: channel can be same as that chosen by neighboring AP"* [WL 12]. Dense deployments put many BSSs on the same channel.
2. **Crowded, unprotected ISM band**: 2.4 GHz is shared with cordless phones, Bluetooth and **microwave ovens**. ISM users **must tolerate interference** and have **no regulatory protection** [WL 21, 23; WC-S 10].
3. **Same-frequency signals add directly to the wanted signal**: co-channel (inward) interference **blocks transmissions or causes bit errors** [WCP §10], lowering the SINR.
4. **Hidden stations in neighbouring BSSs** on the same channel cause collisions that carrier sensing can't prevent. The result is lost frames, missing ACKs, retransmissions and lower throughput.

### Q14. Transmitter at 850 MHz, power 125 mW; received power 1 µW. Distance between transmitter and receiver? (6)

**Given**: Pt = 125 mW = 125 × 10⁻³ W; Pr = 1 µW = 1 × 10⁻⁶ W; f = 850 × 10⁶ Hz; c = 3 × 10⁸ m/s.

**Formula**: Lp = Pt/Pr = (4πd/λ)² [WCP Eq 2.1, 2.3].

1. **Path loss**: Lp = Pt/Pr = (125 × 10⁻³)/(1 × 10⁻⁶) = **125 × 10³ = 125 000**
2. **Wavelength**: λ = c/f = (3 × 10⁸)/(850 × 10⁶) = **0.3529 m**
3. **Substitute**: 125 000 = (4πd/0.3529)²
4. **Square root**: √125 000 = **353.55** = 4πd/0.3529
5. **Solve**: d = (353.55 × 0.3529)/(4π) = 124.77/12.566 = **9.93 m**

**Answer: d ≈ 9.93 m** (this is Problem 2.7 in your notes. Note that the notes' printed step "125 × 10⁻³" should read 125 × 10³).

# COM5231 Test 1 — Version B (100 marks)

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

In a mobile system, the receiver often has **no clear line of sight** to the base station. The signal still arrives because of three mechanisms, which also cause **multipath** [WC-B 5.3, Fig 5.5]:

**1. Reflection (4 marks)**: occurs when the EM wave meets a surface that is **large compared with its wavelength**, e.g. the ground, walls, buildings and furniture [WCP]. Part of the energy bounces off. In a mobile system the **ground-reflected wave** and the line-of-sight wave can **cancel each other**, causing high signal loss. Because the mobile antenna is lower than most buildings, many reflected waves arrive, and they combine **constructively or destructively** at the receiver. Reflection is the most significant effect even when LOS exists.

**2. Diffraction (4 marks)**: occurs at the **edge of an impenetrable body that is large compared with the wavelength** (a sharp edge such as a building corner or rooftop). The edge acts as a **new source**: **secondary waves** spread out in different directions, including **into the shadow behind the obstacle**. Signals can therefore be received **even when there is no unobstructed LOS** from the transmitter [WC-B 5.3; WCP].

**3. Scattering (4 marks)**: occurs when the obstacle is **on the order of the wavelength or smaller** and there are **many such objects**: lamp posts, traffic signs, foliage, rough surfaces. The incoming signal is **scattered into many weaker outgoing signals** in all directions. At cellular frequencies such objects are everywhere, so **scattering is hard to predict** [WC-B 5.3].

**Overall effect**: with a clear LOS, diffraction and scattering are minor and reflection matters most. With **no LOS** (e.g. at street level in a city), **diffraction and scattering are the primary means of reception**. Together the three produce **multipath**: several delayed copies that cause **fading and ISI** [WC-B 5.3].

### Q4. Differences between path loss, multipath propagation and interference. (12)

**Path loss** is the **reduction in signal power** as the signal travels from transmitter to receiver. In free space it happens because energy **spreads over an ever-larger sphere**, so Pt/Pr = (4πd/λ)²: loss grows with the **square of distance and of frequency**. Real environments add obstruction and absorption, described by the **path-loss exponent** n (2 in free space, 2.7–3.5 urban, 4–6 obstructed indoors). Path loss is **predictable and deterministic**. It sets the transmit power, receiver sensitivity and SNR needed, and it is countered by **higher power, better antennas or more access points** [WC-B 5.2; WC-S 30–34; WCP §9].

**Multipath propagation** happens when **reflection, diffraction and scattering** from buildings, walls, the ground and small objects make **several copies of the same signal arrive with different delays and phases**. The copies add **constructively or destructively**, causing **fading** (drops of 20–30 dB over half a wavelength) and **intersymbol interference**. It **varies randomly with time and position** as the user moves, and gives "high signal strength but poor quality". It is countered by **equalization, diversity/MIMO, OFDM and spread spectrum** [WC-B 5.3; WCP §7].

**Interference from other sources** is caused by **other transmitters**, not the wanted signal's path. Examples are **co-channel** interference (other WLANs on the same channel, microwave ovens at 2.4 GHz), **adjacent-channel** interference, harmonics and atmospheric noise. It **depends on other users' activity**, lowers the SINR, and causes **bit errors and blocked transmissions**. It is countered by **channel/frequency planning, spread spectrum, directional antennas and removing the source** [WCP §10; WC-S 10].

| | Path loss | Multipath | Interference |
|---|---|---|---|
| Cause | Distance/frequency spreading | Reflection, diffraction, scattering of **own** signal | **Other** transmitters |
| Behaviour | Deterministic, smooth | Random, time-varying (fading, ISI) | Random/bursty, depends on others |
| Fix | Power, antennas, more APs | Equalization, diversity, OFDM | Channel planning, spread spectrum |

**Additional points for full marks:**

- **Path loss**: example: indoors it increases ~**20 dB per 100 ft**; the main countermeasure is **additional access points** [WCP §9]. Expressed as Lp = (4πd/λ)² = Pt/Pr.
- **Multipath**: it is especially severe **indoors**; vendors use **equalization and antenna diversity** and may need **lower data rates** [WCP §7]. It produces **Doppler** effects when the receiver moves.
- **Interference**: two directions: **inward** (co-channel, from other systems on similar frequencies, e.g. microwave ovens at 2.4 GHz) and **outward** (adjacent-channel: your WLAN disrupting others, e.g. aircraft navigation). It is uncommon in spread-spectrum WLAN bands because power is low (< 1 W), so devices must be close and in the same band [WCP §10].

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

**General principle (2 marks)**: spread spectrum is designed for wireless, where stations share the air and need protection from **eavesdropping and jamming**. It adds **redundancy** by expanding bandwidth **B to Bss ≫ B**. Two principles: (1) the allocated bandwidth is **much larger than needed**; (2) the spreading is done **after** the signal is created, by a process **independent of the signal**, using a **spreading code** that looks random but is a pattern [SS].

**(i) FHSS (4 marks)**:
- Uses **M carrier frequencies**. At each moment the source modulates **one carrier**, and the next moment another.
- A **pseudorandom code generator** produces a **k-bit pattern each hopping period Th** (M = 2ᵏ); a **frequency table** maps it to a frequency; a **frequency synthesizer** generates it; the **modulator** applies the data.
- *Example*: M = 8, k = 3; the pattern 101, 111, 001, … selects 700 kHz, 900 kHz, 300 kHz, … and repeats after 8 hops.
- **Privacy**: an intruder can only capture a **small piece** without the sequence. **Anti-jamming**: a jammer can hit **one hop, not the whole transmission**. **Sharing**: M stations can share Bss, like FDM with the allocation changing every hop [SS].

**(ii) DSSS (4 marks)**:
- **Each data bit is replaced by n bits called chips**, using a spreading code. The **chip rate is n times the bit rate**, so the bandwidth grows n times.
- *Example*: the **Barker sequence** (n = 11, **10110111000**) used in wireless LANs. With polar NRZ, the spread signal = data × chips (a 1 sends the code, a 0 sends its inverse). The required bandwidth is **11×** the original.
- **Privacy** if the intruder doesn't know the code; **immunity to interference** if each station uses a different code. Bandwidth can be **shared** only if special (orthogonal) codes are used, i.e. **CDMA** [SS].

### Q7. Describe CDMA and explain why it is difficult to jam. (10)

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

# Test 2 2025 (100 marks)

### Q1. State and explain the three categories of routing protocols in MANETs. (12)

*SUPPLEMENTARY (no lecture notes provided), plus [WL 8–9] and [BT-S 87].*

**Why it is complicated (4 marks):**
1. **Dynamic topology**: nodes are **mobile**, so links break and form continuously and routes go stale quickly.
2. **No infrastructure or central controller**: there are no dedicated routers or APs. **Every node must also act as a router** and forward others' packets [WL 8–9], and decisions are distributed.
3. **Limited, shared wireless bandwidth**: routing control traffic competes with data, so flooding updates is expensive.
4. **Limited battery and processing power** in mobile nodes.
5. **Unreliable links**: fading, interference, **hidden/exposed terminals**, high error rates and asymmetric links; plus multi-hop delay and security concerns.

**Three categories (6 marks):**
1. **Proactive (table-driven)**: every node **maintains routes to all destinations at all times** using **periodic/triggered updates**. Routes are **available immediately** (low latency), but **control overhead is high and constant**, and wasted on routes never used and under high mobility. *Example: **DSDV** (Destination-Sequenced Distance Vector); also OLSR.*
2. **Reactive (on-demand / source-initiated)**: routes are found **only when a source needs one**, through **route discovery** (flood a route request; the destination replies) and **route maintenance**. **Low overhead** when traffic is light, but a **discovery delay** before the first packet. *Example: **AODV** (Ad hoc On-demand Distance Vector), which ZigBee uses: it "sends out route requests and either responds or forwards the messages to other nodes until someone responds" [BT-S 87]; also DSR.*
3. **Hybrid**: **proactive within a local zone** around each node and **reactive between zones**, which balances latency and overhead and scales to large networks. *Example: **ZRP** (Zone Routing Protocol).*

**Additional detail for 12 marks:**

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

**Count to infinity**: in distance-vector routing, **bad news travels slowly**. When a link cost increases or a link fails, a node may switch to a neighbour's **stale** advertised route, which in fact passes **back through itself**. This creates a **routing loop**: the two nodes repeatedly re-advertise, each raising its estimate by a small amount per exchange, "**counting up**" to the true cost, or **to infinity** if the destination is unreachable. *Example*: y–x = 4, y–z = 1, z–x = 50. If y–x rises to 60, y picks the path via z (1 + 5 = 6), z picks via y (7), and so on for 44 exchanges, with packets looping between y and z. (Fixes: poisoned reverse, split horizon, a maximum hop count.)

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

**Comparison (5 marks)**: 

| Aspect | **Wired LAN** | **Wireless LAN** |
|---|---|---|
| Medium | Wires; dedicated/switched links | **Air**; the signal is **broadcast** and **shared** by all hosts |
| Hosts | Fixed attachment point | **Not physically connected**; can **move freely** |
| Isolated LAN | Hosts joined by a link-layer **switch** | **Ad hoc network**: hosts communicate directly, **no AP** |
| Connection to other networks | Via a **router** | Via an **access point** that joins the wireless and wired environments |
| Moving between them | Change the NICs and replace the switch with an AP: **MAC addresses change, IP addresses stay the same** | |
| Access method | **CSMA/CD** | **CSMA/CA** |
| Channel | Negligible attenuation and interference | **Attenuation, interference, multipath, higher error rate** |

Also from [WL 3]: wireless gives flexibility, ad hoc operation and disaster robustness, but lower bandwidth, lower QoS and higher delay.

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

A systematic approach (about 1 mark per explained step) [WCP §9–10; WC-S 9–10; WL 12, 21–23; WC-B 5.4]:
1. **Characterise the problem**: record **when** it happens (time of day, which events), **where** (which areas), and **which channels/frequencies**. "Occasional" loss suggests an **intermittent source**, e.g. a **microwave oven at 2.4 GHz** or a neighbouring network's bursts.
2. **Survey the spectrum**: use a **spectrum analyser / WLAN site-survey tool** to identify interfering signals and **co-channel or adjacent-channel** networks. Decide whether it is **inward** interference (others → us) or something we cause (outward).
3. **Identify and locate the source**: microwave ovens, cordless phones, Bluetooth devices, neighbouring APs, other ISM equipment, faulty electrical equipment (impulse noise).
4. **Remove, switch off, shield or relocate** the interfering device, or **increase the separation** between it and the receiver. Interference needs the devices to be **close and in the same band** [WCP §10].
5. **Change channel**: move the AP/link to a **clear, non-overlapping channel** (e.g. 1, 6 or 11 in 2.4 GHz), or move to the **less crowded 5 GHz band** [WL 23].
6. **Improve the antenna system**: reposition/raise the antenna to restore LOS; use **directional antennas** that point at the wanted transmitter and **reject** interference from other directions; use **antenna/space diversity** [WC-B 5.4].
7. **Improve the link margin**: increase the **wanted signal's power or antenna gain** within regulatory limits, so the **SINR** stays above threshold during interference bursts.
8. **Use robust transmission techniques**: **spread spectrum / (adaptive) frequency hopping**, **FEC**, **adaptive modulation and coding / lower data rates**, and ARQ to ride out bursts [WC-B 5.4].
9. **Network design**: add APs or reduce cell size; coordinate channel and power plans with neighbouring networks.
10. **Verify and monitor**: re-test after each change, and keep monitoring to confirm the problem has gone.

### Q7. While Bluetooth's profiles add significant complexity, how can they benefit applications from the application's perspective? (10)

1. **Guaranteed interoperability between vendors**: the profile specification exists *"to define a standard of interoperability so that products from different vendors that claim to support a given usage model will work together"* [BT-B]. A user's headset, car kit or keyboard works with any phone or PC supporting the same profile.
2. **A complete recipe for each usage model**: a profile is *"a set of protocols that implement a particular Bluetooth-based application"*. It states which parts of the core specification are **mandatory, optional and not applicable** [BT-B]. Application developers don't have to interpret the 2500+ page core themselves; the design decisions are made for them.
3. **Reuse of existing protocols and other profiles**: profiles build on each other. E.g. the **File Transfer Profile depends on the Generic Object Exchange, Serial Port and Generic Access profiles**, using **OBEX** over **RFCOMM** and **L2CAP** [BT-B]. Developers reuse proven components rather than writing new ones.
4. **Smaller, cheaper, lower-power implementations**: a device implements **only the profiles it needs** (a mouse doesn't need file transfer), keeping Bluetooth's key attributes of **low cost and low power** [BT-B].
5. **Consistent behaviour and easy setup**: every device supports the **Generic Access Profile**, so discovery, connection and security work the same everywhere. With **SDP**, devices can query each other's services and connect automatically. This gives plug-and-play operation and simpler testing and certification [BT-B].

### Q8. Scatternet of 2 piconets, no CSMA, 80 frequencies: probability of collision? (10)

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

**Yes. A device cannot be master of two piconets.** A piconet is **defined by its master**: the **frequency-hopping sequence (channel) and the phase (timing)** used by all its members are computed **from the master's own Bluetooth address and clock** [BT-B]. If one device were master of both, **both would follow the identical hopping sequence and timing, i.e. they would be the same piconet**, not two separate ones (and together they would be limited to 7 active slaves). A device **can** belong to two piconets as **slave in both** or **master in one and slave in the other**, time-sharing between the two hop sequences. That is how scatternets are formed [BT-B Fig 12.2].

Also: a device in two piconets must **time-share**. It follows one piconet's hop sequence and timing, then the other's. As master it would have to **impose its own hop sequence on both**, which would merge them into one.

### Q10. Two ISPs in a café. (i) Both on channel 11. (10) (ii) Channels 1 and 11. (10)

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

# Exam Paper, Page 4 — Question 4(e) and Question 5

### 4(e) Scatternet of 2 piconets, no CSMA. What is the probability of a collision between packets of the two piconets? Successful transmission needs a successful poll (master → slave) and a successful reply (slave → master). 80 frequencies; all piconets always have packets. (4)

**Assumptions** (from [BT-B]): each piconet hops **independently and pseudorandomly** over the 80 frequencies; both transmit in every slot; a collision occurs when both use the **same frequency in the same slot**.
1. P(collision in one slot) = **1/80**.
2. P(a slot is collision-free) = **79/80**.
3. A transaction = **poll + reply** = 2 slots on 2 independent hops:
 P(success) = (79/80)² = 6241/6400 = **0.9752**.
4. **P(collision) = 1 − (79/80)² = 159/6400 ≈ 0.0248 ≈ 2.5%.**

(Per individual packet the probability is 1/80 = 1.25%. Because a successful exchange needs **two** collision-free packets, the transaction collision probability is about **2.5%**.)

### 5(a) As a mobile node moves farther from a base station, what two actions could the BS take so that the loss probability of a transmitted frame does not increase? (2)

1. **Increase its transmission power**, to compensate for the larger path loss (∝ d²) and keep the SNR up [WC-B 5.2].
2. **Reduce the transmission rate**: switch to a **more robust modulation and coding scheme** (adaptive modulation and coding / 802.11 rate adaptation), which tolerates the lower SNR [WC-S 51; WL 23].

### 5(b) Use Figure 2 to explain the "hidden node" problem. What happens when A and C start sending simultaneously? (4)

In Figure 2, **B is within range of both A and C, but A and C are outside each other's range**. When A transmits to B, **C cannot hear A**, so C's carrier sense finds the channel idle. A and C are **hidden from each other with respect to B** [FZ].
**If A and C send at the same time** (e.g. both to B): both sense an idle medium and transmit. Their signals **overlap at B, so B receives a collision** and can decode neither frame. Since wireless stations **cannot detect collisions**, A and C keep sending their **whole frames**, wasting the channel. Neither receives an **ACK**, so both time out, **back off a random time and retransmit**. Hidden nodes therefore **reduce network capacity** [FZ; WL 29].

### 5(c) Use Figure 2 to explain how CSMA/CA is realised in IEEE 802.11. Assume A wants to send a frame to the destination (B). (4)

1. **Carrier sense**: A checks its **NAV** and senses the medium. When idle, it waits **DIFS**, then counts down a **random backoff** (the counter freezes if the medium becomes busy) [WL 32–35].
2. **RTS**: A sends an RTS containing the **duration** of the whole exchange. B hears it (C doesn't).
3. **CTS**: after **SIFS**, B replies with a CTS that also carries the duration. **C is in B's range, so it hears the CTS, sets its NAV and defers**, even though it can't hear A. This is how the hidden node is handled [FZ; WL 39, 43].
4. **DATA and ACK**: after SIFS, A sends the data. After SIFS, B returns an **ACK**. If A gets no CTS or no ACK, it assumes a collision, backs off and retries [WL 35, 38].

### 5(d) Why are acknowledgements used in 802.11 but not in wired Ethernet? (2)

In wired Ethernet (CSMA/CD) the sender **detects collisions**, and *"if a collision is not detected, it is a kind of acknowledgment that the frame was received"*; wired error rates are also very low [FZ]. In 802.11, a station **cannot detect collisions** (it can't send and receive at once; hidden stations; fading), and frames are frequently lost to **noise, interference and fading**. So *"the station does not have any means to check for the successful arrival of its data"*, and an **explicit ACK** (with retransmission on timeout) is required [FZ; WL 27].

### 5(e) Two ISPs provide WiFi in a café, each with its own AP and IP address block.

#### (i) By accident both APs use channel 11. Will 802.11 completely break down? What happens when two stations, each associated with a different ISP, transmit at the same time? (4)
**No, it does not break down.** The two BSSs simply **share one channel as a single collision domain**. Every station still runs **CSMA/CA**: it senses the channel and its NAV, so stations from **both** ISPs **defer to each other** and take turns, as if they were one bigger BSS. (The different IP blocks don't matter at the MAC layer; each AP only accepts frames addressed to its own BSS.)
If two stations from different ISPs **transmit at the same moment** (e.g. their backoff counters expire together, or they are hidden from each other), their frames **collide**. Neither AP receives a correct frame, **no ACKs are returned**, both stations **back off a random time** (with a larger contention window) and **retransmit**. The result is **more collisions and lower throughput for both ISPs** (each gets roughly half the channel capacity), but the network keeps working.

#### (ii) Now one AP uses channel 1 and the other channel 11. How do the answers change? (4)
Channels **1 and 11 do not overlap** (in the 2.4 GHz band, signals are ~22 MHz wide [WC-S 4] and channels are 5 MHz apart, so 1 and 11 are 50 MHz apart; SUPPLEMENTARY). The two BSSs now form **two independent collision domains**:
- Stations of different ISPs **don't hear each other's transmissions** in carrier sense, so they **don't defer to each other**.
- **Two stations can transmit at the same time without colliding**: each frame reaches its own AP successfully and is ACKed.
- **Each ISP gets the full capacity of its own channel**: aggregate throughput roughly **doubles**, with fewer collisions and backoffs.
