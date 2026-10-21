# About These Answers

These are model answers for the **green exam paper** (pages 2–4; 5 questions × 20 marks = 100). Page 1 was not photographed, so its title and year are unknown.

- Original numbering and marks are kept. Answer length matches the marks, at roughly one well-explained point per 1–2 marks.
- Sources from your lecture notes are shown in brackets: [WC] wireless channel notes, [WCP] wireless problems, [MA] multiple access, [MX] multiplexing notes, [SS] spread spectrum, [OF] OFDM, [ED] error-detection worksheet, [WL] WLAN slides, [FZ] Forouzan WLAN chapter, [BT-B]/[BT-S] Bluetooth book/slides.
- **Question 3 and Q2(d) (routing) are SUPPLEMENTARY.** Your uploaded notes don't cover routing, so these answers follow the standard textbook method (Kurose & Ross; the Figure 1 network comes from that book).
- No memorandum was provided. These are **model answers, not the lecturer's marking guide**. Every calculation has been checked by computer.


# QUESTION 1 (20 marks)

### 1(a) What are the differences between the following types of wireless channel impairments: path loss, multipath propagation, and interference from other sources? (6)

**Path loss** is the **reduction in signal power** as the signal travels from transmitter to receiver. In free space it happens because energy **spreads over an ever-larger sphere**, so Pt/Pr = (4πd/λ)²: loss grows with the **square of distance and of frequency**. Real environments add obstruction and absorption, described by the **path-loss exponent** n (2 in free space, 2.7–3.5 urban, 4–6 obstructed indoors). Path loss is **predictable and deterministic**. It sets the transmit power, receiver sensitivity and SNR needed, and it is countered by **higher power, better antennas or more access points** [WC-B 5.2; WC-S 30–34; WCP §9].

**Multipath propagation** happens when **reflection, diffraction and scattering** from buildings, walls, the ground and small objects make **several copies of the same signal arrive with different delays and phases**. The copies add **constructively or destructively**, causing **fading** (drops of 20–30 dB over half a wavelength) and **intersymbol interference**. It **varies randomly with time and position** as the user moves, and gives "high signal strength but poor quality". It is countered by **equalization, diversity/MIMO, OFDM and spread spectrum** [WC-B 5.3; WCP §7].

**Interference from other sources** is caused by **other transmitters**, not the wanted signal's path. Examples are **co-channel** interference (other WLANs on the same channel, microwave ovens at 2.4 GHz), **adjacent-channel** interference, harmonics and atmospheric noise. It **depends on other users' activity**, lowers the SINR, and causes **bit errors and blocked transmissions**. It is countered by **channel/frequency planning, spread spectrum, directional antennas and removing the source** [WCP §10; WC-S 10].

| | Path loss | Multipath | Interference |
|---|---|---|---|
| Cause | Distance/frequency spreading | Reflection, diffraction, scattering of **own** signal | **Other** transmitters |
| Behaviour | Deterministic, smooth | Random, time-varying (fading, ISI) | Random/bursty, depends on others |
| Fix | Power, antennas, more APs | Equalization, diversity, OFDM | Channel planning, spread spectrum |

### 1(b) Explain the spread spectrum principles of (i) FHSS and (ii) DSSS. (4)
Spread spectrum expands the bandwidth B needed by a signal to **Bss ≫ B** using a **pseudorandom spreading code that is independent of the signal**. This gives privacy and resistance to jamming and interference [SS].

**(i) FHSS**: a **pseudorandom code generator** produces a k-bit pattern every **hopping period**. A **frequency table** maps it to one of **M = 2ᵏ carrier frequencies**, and a **frequency synthesizer** generates that carrier, which the data modulate. The signal **hops from carrier to carrier**, using one narrow frequency at a time but all M over time. A jammer or eavesdropper who doesn't know the sequence can only hit or catch **one hop** [SS].

**(ii) DSSS**: **each data bit is replaced by n chips** from a spreading code (e.g. the **11-chip Barker sequence 10110111000**), so the **chip rate = n × bit rate** and the bandwidth grows n times. The receiver correlates with the same code to recover the data. Without the code the signal looks like noise, and narrowband interference is spread out and suppressed [SS].

### 1(c) What are the benefits of each of the following OFDMA approaches: (i) adjacent subcarriers, (ii) regularly spaced subcarriers, (iii) randomly spaced subcarriers? (6)
In OFDMA, subcarriers are grouped into **subchannels** that are allocated to users. The three ways of forming subchannels each have benefits [OF §8.2]:

**(i) Adjacent subcarriers** (a contiguous block): all subcarriers in the block have **about the same SINR**. This creates an **opportunity**: the system can **choose, from many possible blocks, the best block for each user**, optimising **channel efficiency, user requirements, priority and fairness**. It exploits frequency-selective fading for multi-user gain. (The cost is that it needs accurate, up-to-date **channel knowledge across the whole bandwidth**, via pilots and prediction; used by LTE and WiMAX.)

**(ii) Regularly spaced subcarriers** ("distributed"/"comb"): spreading a user's subcarriers across the band gives **frequency diversity**, so **enough good subcarriers are obtained whichever are chosen**, even in frequency-selective fading. The **channel-estimation burden is much lower** (used by LTE).

**(iii) Randomly spaced subcarriers**: the **same frequency-diversity benefit** as regular spacing, **plus reduced adjacent-cell interference**, because neighbouring cells' random patterns rarely coincide (used by WiMAX).

### 1(d) Describe CDMA and explain why it is difficult to jam. (4)
**CDMA** lets **all users transmit over the entire bandwidth at the same time**. Each user is separated by a **unique pseudorandom (orthogonal) code** that **spreads** its baseband data at a much higher **chip rate**. The spread signal is transmitted **below the noise level**. The receiver uses a **correlator with the same code to despread** the wanted signal, which then passes a narrowband filter. Other users' signals are **not despread** and remain low-level noise. **Precise power control** keeps every transmitter at the minimum power [MA p7–8].

**Difficult to jam because**:
1. The energy is **spread over a very wide band at very low power density**, so a jammer must cover the whole band to have an effect.
2. **Despreading spreads the jammer**: the correlator collapses the wanted signal back to narrowband but **spreads the jamming signal** (it doesn't carry the user's code), and the **narrowband filter removes most of it**.
3. The **pseudorandom code is unknown** to the jammer, so it cannot concentrate its energy where the signal is.

That is why spread-spectrum CDMA was used in **WWII to foil enemy jamming** [MX], and why its stated uses include **suppressing interference and making interception difficult** [MA p7].

---

# QUESTION 2 (20 marks)

### 2(a) An 8-bit byte 10101111 is encoded using an even-parity Hamming code. How many check bits are needed to detect and correct single-bit errors? What is the codeword? (4)
**Check bits**: we need r with **2^r ≥ m + r + 1**, with m = 8.
- r = 3: 2³ = 8 ≥ 12? No.
- r = 4: 2⁴ = 16 ≥ 13? Yes → **4 check bits** (codeword length 12).

**Convention**: positions 1–12 numbered from the left; check bits at **1, 2, 4, 8**; data bits in order in 3, 5, 6, 7, 9, 10, 11, 12.

| Pos | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| | P1 | P2 | 1 | P4 | 0 | 1 | 0 | P8 | 1 | 1 | 1 | 1 |

- P1 (3, 5, 7, 9, 11) = 1, 0, 0, 1, 1 → three 1s → **P1 = 1**
- P2 (3, 6, 7, 10, 11) = 1, 1, 0, 1, 1 → four 1s → **P2 = 0**
- P4 (5, 6, 7, 12) = 0, 1, 0, 1 → two 1s → **P4 = 0**
- P8 (9, 10, 11, 12) = 1, 1, 1, 1 → four 1s → **P8 = 0**

**Codeword = 1 0 1 0 0 1 0 0 1 1 1 1 = 101001001111.** [ED worksheet exercise; method SUPPLEMENTARY per the UNB Hamming page linked in ED]

### 2(b) A bit stream 101110 is transmitted using the standard CRC method with generator 1001. Show the actual bit string transmitted. (4)
G = 1001 has degree **3**, so append **000** → dividend **101110000**. Modulo-2 division (XOR):
```
101110000
1001
────
0010 → bring down → 1010
         1001
         ────
         0011 → bring down → 1100
                   1001
                   ────
                   0101 → bring down → 1010
                             1001
                             ────
                              011   ← remainder
```
Steps: 1011⊕1001 = 0010; 1010⊕1001 = 0011; 1100⊕1001 = 0101; 1010⊕1001 = 0011.
**CRC = 011** → **transmitted string = 101110011**. (Check: 101110011 ÷ 1001 gives remainder 000.) [ED method]

### 2(c) Message 1001 1100 1010 0011 transmitted using the Internet checksum (4-bit words). Value of the checksum? (2)
One's-complement addition with end-around carry:
- 1001 + 1100 = 1 0101 → wrap → 0101 + 1 = **0110**
- 0110 + 1010 = 1 0000 → wrap → 0000 + 1 = **0001**
- 0001 + 0011 = **0100**

**Sum = 0100 → checksum = one's complement = 1011.** (The receiver adds all words + 1011 = 1111, meaning no error.) [ED exercise]

### 2(d) Why is routing in ad-hoc networks complicated? State and explain the three categories of MANET routing protocols, with an example of each. (10)
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

---

# QUESTION 3 (20 marks) — *All SUPPLEMENTARY (no routing notes provided)*

### 3(a) Compare and contrast link-state and distance-vector routing algorithms. (4)
**Similarities**: both compute **least-cost paths** over a graph of link costs, build a **forwarding table**, and adapt dynamically to cost changes.

**Differences**:

| | **Link-state** | **Distance-vector** |
|---|---|---|
| Knowledge | **Global**: complete topology at every router | **Local**: only neighbours' distance estimates |
| Algorithm | **Dijkstra** | **Bellman-Ford** |
| Advertisement | Own link costs **flooded to all** routers | Whole distance vector sent **only to neighbours** |
| Convergence | **Fast**, no loops | **Slow**; routing loops; **count-to-infinity** |
| Robustness | Errors stay local (each computes its own table) | A wrong cost **propagates network-wide** |
| Example | OSPF | RIP |

### 3(b) What is the essential difference between Dijkstra's algorithm and the Bellman-Ford algorithm? (4)
**Dijkstra** is a **global, greedy** algorithm: the node running it must know the **entire network graph**. It **permanently settles one node per iteration**, always the closest unsettled node, so it finishes in **n iterations** (O(n²)). It requires **non-negative** costs.
**Bellman-Ford** is **decentralised and iterative**: each node computes **dₓ(y) = minᵥ{c(x,v) + dᵥ(y)}** using **only its neighbours' current estimates**, and **repeatedly relaxes** all distances until nothing changes. It is naturally **distributed and asynchronous** (distance-vector routing) and **handles negative costs**, but **converges slowly** and can **count to infinity**.
**Essence**: *Dijkstra = complete global knowledge, nodes settled one at a time; Bellman-Ford = neighbour-only information, iterative relaxation until convergence.*

### 3(c) Apply Dijkstra's algorithm to Figure 1, showing the step-by-step process.
**Link costs from Figure 1**: x–z 8, x–y 6, x–v 3, x–w 6, y–z 12, y–v 8, y–t 7, v–t 4, v–u 3, v–w 4, t–u 2, w–u 3.
Notation: D(n),p(n) = current least cost and predecessor; "—" = already in N'.

#### (i) Shortest paths from t (4)
| Step | N' | D(u),p | D(v),p | D(w),p | D(x),p | D(y),p | D(z),p |
|---|---|---|---|---|---|---|---|
| 0 | t | **2,t** | 4,t | ∞ | ∞ | 7,t | ∞ |
| 1 | tu | — | **4,t** | 5,u | ∞ | 7,t | ∞ |
| 2 | tuv | — | — | **5,u** | 7,v | 7,t | ∞ |
| 3 | tuvw | — | — | — | **7,v** | 7,t | ∞ |
| 4 | tuvwx | — | — | — | — | **7,t** | 15,x |
| 5 | tuvwxy | — | — | — | — | — | **15,x** |
| 6 | tuvwxyz | — | — | — | — | — | — |

Updates: via u: w = 2 + 3 = 5. Via v: x = 4 + 3 = 7 (y via v = 12 > 7; w via v = 8 > 5). Via x: z = 7 + 8 = 15 (y via x = 13 > 7). Via y: z = 7 + 12 = 19 > 15.

| To | u | v | w | x | y | z |
|---|---|---|---|---|---|---|
| Cost | 2 | 4 | 5 | 7 | 7 | 15 |
| Path | t-u | t-v | t-u-w | t-v-x | t-y | t-v-x-z |

#### (ii) Shortest paths from w (4)
| Step | N' | D(t),p | D(u),p | D(v),p | D(x),p | D(y),p | D(z),p |
|---|---|---|---|---|---|---|---|
| 0 | w | ∞ | **3,w** | 4,w | 6,w | ∞ | ∞ |
| 1 | wu | 5,u | — | **4,w** | 6,w | ∞ | ∞ |
| 2 | wuv | **5,u** | — | — | 6,w | 12,v | ∞ |
| 3 | wuvt | — | — | — | **6,w** | 12,v | ∞ |
| 4 | wuvtx | — | — | — | — | **12,v** | 14,x |
| 5 | wuvtxy | — | — | — | — | — | **14,x** |
| 6 | wuvtxyz | — | — | — | — | — | — |

Updates: via u: t = 3 + 2 = 5 (v via u = 6 > 4). Via v: y = 4 + 8 = 12 (x via v = 7 > 6; t via v = 8 > 5). Via t: y = 5 + 7 = 12 (tie). Via x: z = 6 + 8 = 14; y = 6 + 6 = 12 (tie). Via y: z = 24 > 14.

| To | u | v | t | x | y | z |
|---|---|---|---|---|---|---|
| Cost | 3 | 4 | 5 | 6 | 12 | 14 |
| Path | w-u | w-v | w-u-t | w-x | w-v-y* | w-x-z |

*y has **three equal-cost paths of 12**: w-v-y, w-x-y and w-u-t-y.

### 3(d) What is the "count to infinity" problem? Will it occur if we decrease a link cost? Why? What if we connect two nodes that have no link? (4)
**Count to infinity**: in distance-vector routing, **bad news travels slowly**. When a link cost increases or a link fails, a node may switch to a neighbour's **stale** advertised route, which in fact passes **back through itself**. This creates a **routing loop**: the two nodes repeatedly re-advertise, each raising its estimate by a small amount per exchange, "**counting up**" to the true cost, or **to infinity** if the destination is unreachable. *Example*: y–x = 4, y–z = 1, z–x = 50. If y–x rises to 60, y picks the path via z (1 + 5 = 6), z picks via y (7), and so on for 44 exchanges, with packets looping between y and z. (Fixes: poisoned reverse, split horizon, a maximum hop count.)

**Decrease a link cost: No.** It is **good news, and good news travels fast**. Each node recomputes a **lower** cost using the cheaper link and advertises it, so distances only decrease and converge in a few iterations. No node is left relying on an outdated, too-cheap path, so no loop forms.

**Connect two nodes that had no link: No.** Adding a link is the same as **decreasing its cost from ∞ to a finite value**: good news, which propagates quickly.

---

# QUESTION 4 (20 marks)

### 4(a) What are the differences between a master device in a Bluetooth network and a base station in an 802.11 network? (4)
1. **Medium access**: the **Bluetooth master controls all access**. It sets the **hopping sequence and timing** from its own address, and slaves may transmit **only when polled** by the master (FH-TDD-TDMA), so there is **no contention within a piconet**. In 802.11, stations **contend using CSMA/CA (DCF)** with random backoff, and the AP only polls in the **optional PCF** mode [BT-B; WL 32–40].
2. **Connection to other networks**: the **802.11 AP provides a link to other networks** (it bridges the BSS to the wired distribution system/Internet) and relays all MAC frames. The **Bluetooth master sets up the piconet and relays traffic inside it**, an ad hoc PAN that doesn't itself bridge to infrastructure [BT-S 64; FZ].
3. **Size and range**: a master serves at most **7 active slaves** within ~**10 m**; an AP serves many stations over tens to hundreds of metres [BT-B].
4. **Role**: any Bluetooth device can be master (a dynamic role); an AP is a dedicated infrastructure device.

### 4(b) Does the hidden terminal problem occur in Bluetooth? Explain. (4)
**No, not within a piconet.** The hidden terminal problem arises in **contention-based** access (CSMA), where two stations that can't hear each other both sense an idle channel and transmit to a common receiver. In Bluetooth, **the master polls**: *"a slave is permitted to return an ACL packet in the slave-to-master slot if and only if it has been addressed in the preceding master-to-slave slot"* [BT-B], and SCO slots are reserved. **Slaves never decide on their own to transmit**, and all are in range of the master that schedules them, so two slaves cannot collide at the master.
(Packets from **different piconets** can collide when they hop to the same frequency in the same slot, but that is an FH-CDMA collision handled by FEC/ARQ, not a hidden terminal problem.)

### 4(c) Profiles add significant complexity. How can they be an advantage from the perspective of the applications? (4)
1. **Interoperability**: a profile is *"a standard of interoperability so that products from different vendors that claim to support a given usage model will work together"* [BT-B]. An application (e.g. a headset or file transfer) works with any compliant device.
2. **Ready-made, reusable design**: each profile defines exactly **which protocols and features are mandatory, optional or not applicable** for a usage model, so application developers don't have to design their own use of the 2500-page core. E.g. the **File Transfer Profile** reuses **OBEX, RFCOMM and L2CAP** [BT-B].
3. **Only the needed subset is implemented**: smaller, cheaper, lower-power devices.
4. **Consistent common functions**: all devices support the **Generic Access Profile** (discovery, connection, security), so applications behave predictably and plug-and-play [BT-B].

### 4(d) A Bluetooth device can be in two piconets at the same time. Is there any reason why one device cannot be the controller in both of them at the same time? (4)
**Yes. A device cannot be master of two piconets.** A piconet is **defined by its master**: the **frequency-hopping sequence (channel) and the phase (timing)** used by all its members are computed **from the master's own Bluetooth address and clock** [BT-B]. If one device were master of both, **both would follow the identical hopping sequence and timing, i.e. they would be the same piconet**, not two separate ones (and together they would be limited to 7 active slaves). A device **can** belong to two piconets as **slave in both** or **master in one and slave in the other**, time-sharing between the two hop sequences. That is how scatternets are formed [BT-B Fig 12.2].

### 4(e) Scatternet of 2 piconets, no CSMA. What is the probability of a collision between packets of the two piconets? Successful transmission needs a successful poll (master → slave) and a successful reply (slave → master). 80 frequencies; all piconets always have packets. (4)
**Assumptions** (from [BT-B]): each piconet hops **independently and pseudorandomly** over the 80 frequencies; both transmit in every slot; a collision occurs when both use the **same frequency in the same slot**.
1. P(collision in one slot) = **1/80**.
2. P(a slot is collision-free) = **79/80**.
3. A transaction = **poll + reply** = 2 slots on 2 independent hops:
 P(success) = (79/80)² = 6241/6400 = **0.9752**.
4. **P(collision) = 1 − (79/80)² = 159/6400 ≈ 0.0248 ≈ 2.5%.**

(Per individual packet the probability is 1/80 = 1.25%. Because a successful exchange needs **two** collision-free packets, the transaction collision probability is about **2.5%**.)

---

# QUESTION 5 (20 marks)

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
