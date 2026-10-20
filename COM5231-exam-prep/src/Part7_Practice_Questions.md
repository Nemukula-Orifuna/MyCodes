# Part 7 — Additional Practice Questions with Model Answers

> **These are GENERATED practice questions, not taken from past papers.** They are built from your lecture notes and the patterns in Part 4, with high-frequency topics weighted most. Every numerical answer has been computed and checked. Suggested marks are shown in brackets.
>
> **How to use**: cover the answer, write your own answer in exam conditions, then mark it against the model.

---

## SECTION A — Short definition questions (2 marks each)

**A1. Define multiple access.** *(2)*
The technique that lets **many mobile users share a finite amount of radio spectrum simultaneously and efficiently**, so the system handles **as many calls as possible in a given bandwidth** (call-handling capacity) [MA p2].

**A2. Define the path loss exponent.** *(2)*
A parameter **n** describing **how fast a radio signal's power decreases with distance** in a given environment (Pr ∝ 1/dⁿ): 2 in free space, 2.7–3.5 in an urban cellular area, 4–6 obstructed in a building [WC-S 33–34].

**A3. Define coherence time and state when a channel is fast fading.** *(2)*
**Coherence time Tc** is the time over which the channel stays relatively constant. The channel is **fast fading** when Tc is **not much greater** than the bit time Tb (Tc < Tb, Tc ≈ Tb or only slightly greater) [WC-B 5.3].

**A4. What is intersymbol interference?** *(2)*
**Delayed copies of a pulse (from multipath) arriving at the same time as the primary pulse of a subsequent bit**, acting as noise to it and making detection difficult [WC-S 40].

**A5. Define the NAV.** *(2)*
The **network allocation vector**: a timer set by stations that hear an RTS/CTS (which carry the duration of the exchange), showing **how long they must wait before checking the channel for idleness**. It is virtual carrier sensing [WL 37].

**A6. What is a piconet?** *(2)*
The basic Bluetooth network unit: **one master and one to seven active slaves**, sharing the master's **frequency-hopping sequence and timing**. Slaves communicate only with the master, when permitted [BT-B].

**A7. Define chip rate.** *(2)*
The **rate of a spreading code** in spread spectrum/CDMA. It is **much higher than the data bit rate** (e.g. 11 chips per bit with the Barker code), and is called the chip rate rather than the bit rate [MA p8; SS].

**A8. What is the purpose of a guard band in FDMA?** *(2)*
An **unused frequency slot between adjacent channels** that **minimises crosstalk/adjacent-channel interference**, at the cost of wasted bandwidth [MA p4].

**A9. Define a burst error and its length.** *(2)*
A burst error is **two or more bits changed** in a data unit. Its **length** is measured **from the first to the last corrupted bit, inclusive** (SUPPLEMENTARY).

**A10. What is orthogonality in OFDM?** *(2)*
Two signals are orthogonal if **the average over a bit time of their product is zero**. For OFDM subcarriers spaced at multiples of 1/T, **each subcarrier's spectral peak falls where every other subcarrier's power is zero**, so they overlap without interfering [OF].

**A11. What is a resource block in LTE?** *(2)*
The smallest group of subcarriers (and time slots) that OFDMA assigns to a user: **12 subcarriers** of 15 kHz [AT; OF].

**A12. Name the three power classes of Bluetooth.** *(2)*
**Class 1**: 100 mW (+20 dBm), power control mandatory, greatest range. **Class 2**: 2.5 mW (+4 dBm). **Class 3**: 1 mW [BT-B].

---

## SECTION B — Conceptual explanation questions

**B1. Explain three reasons why CSMA/CD cannot be used in wireless LANs. (6)**
1. **Simultaneous send and receive**: collision detection requires a station to transmit and listen at the same time. Received signals are much weaker than transmitted ones, so this needs costly full-duplex hardware and more bandwidth, and battery-powered stations lack the power [WL 16, 29; FZ].
2. **Hidden station problem**: a collision at the receiver may be **inaudible to the sender**, because the other transmitter is out of its range [FZ].
3. **Distance and fading**: stations can be far apart, so **signal fading** may stop a station at one end from hearing a collision at the other [WL 29].
Therefore 802.11 uses **CSMA/CA** with ACKs [FZ].

**B2. Explain why forward error correction is preferred to backward error correction in wireless systems. (4)**
- In backward error correction (ARQ) the receiver only detects errors and asks for a **retransmission**. In **satellite** links the **delay** makes this undesirable; in **mobile** links **error rates are so high that the retransmitted block is likely to be corrupted too** [WC-S 45].
- FEC adds redundant bits so the receiver **corrects errors itself**, using only the received data. This costs bandwidth (a total/data ratio of 2–3) but avoids retransmission delay [WC-B 5.4].

**B3. Explain the role of the master's Bluetooth address in a piconet. (4)**
The master's address (and clock) determines the **frequency-hopping sequence (channel) and the phase (timing)** for all piconet members. Slaves tune to it [BT-B]. Because different masters have different addresses, **different piconets use different hop sequences**, which gives **FH-CDMA** separation in a scatternet. This is also why one device **cannot be master of two piconets**.

**B4. Describe the three types of diversity and the two ways of using the received signals. (6)**
**Space diversity**: multiple antennas spaced far enough apart (or collocated directional antennas) experience independent fading. **Frequency diversity**: spread the signal over a wider band or multiple carriers (**OFDM, spread spectrum**). **Time diversity**: spread data over time so a noise burst hits fewer bits (**interleaving, Rake receiver**). Use: **selection diversity** (pick the best signal) or **combining diversity** (co-phase and add the signals) [WC-S 48; WC-B 5.4].

**B5. Explain the exposed station problem and why RTS/CTS cannot solve it. (4)**
A transmits to B, and C wants to send to D. C's transmission would **not** interfere at B, but C is **within A's range**, hears A, and **refrains**: it is too conservative and **wastes capacity**. RTS/CTS doesn't help: C hears A's RTS and still defers, because **it cannot know that its transmission would not affect the zone between A and B** [FZ].

**B6. Why does OFDM reduce the need for equalizers? (4)**
OFDM divides the data into **N parallel substreams**, so each subcarrier's **symbol time is N·Ts** instead of Ts. N is chosen so that N·Ts is **much greater than the channel's RMS delay spread**, so multipath delays occupy only a small fraction of each symbol and **ISI is drastically reduced**. Equalizers, which are complex and expensive and grow with ISI severity, **may not be needed** [OF §8.1].

**B7. What is AODV and where is it used in your notes? (4)**
**Ad hoc On-demand Distance Vector**, a **reactive** MANET routing protocol. A source **sends route requests**, which nodes either **answer or forward** until someone (the destination or a node with a route) responds. Nodes **store and use** the routes they discover [BT-S 87]. Your notes mention it as the routing protocol **ZigBee** uses to build multi-hop ad hoc networks.

---

## SECTION C — Comparison questions

**C1. Compare FDMA and TDMA under: principle, synchronisation, efficiency, battery life, equalization. (10)**
| | FDMA | TDMA |
|---|---|---|
| Principle | Spectrum divided into **frequency bands with guard bands**; one user per channel **100% of the time** | Same frequency shared by dividing **time into slots**; users transmit in **bursts** |
| Synchronisation | **Not severe** (continuous transmission) | **Required**: lost sync means slots collide |
| Spectrum efficiency | **Inefficient**: idle channels can't be shared; guard bands waste bandwidth | **More efficient**: more users in the same spectrum |
| Battery / handoff | Continuous transmission | **Longer battery life**; **simpler handoff** (listen in idle slots); but **high peak power** on the uplink |
| Equalization | **Not required** | **Required** (high transmission rates) |
| Duplexer | Needed (forward and reverse frequencies) | **Not required** (different slots for Tx/Rx) |
| Examples | 1G AMPS, FM radio, walkie-talkies | GSM, IS-136, DECT |
[MA p3–7]

**C2. Compare ZigBee coordinator, router and end device. (6)**
| Device | Role | Notes |
|---|---|---|
| **Coordinator** | Most capable; **only one per network**; **starts the network**, is the root of a tree, **maintains network information such as security keys** | Usually mains powered |
| **Router** | **Passes data on** to other devices (multi-hop) | Must stay awake in non-beacon networks |
| **End device** | Just enough function to talk to a router/coordinator; **cannot relay** | **Sleeps most of the time**, least memory, **cheapest** |
[BT-S 85–86]

**C3. Compare SCO and ACL links. (6)**
| | SCO | ACL |
|---|---|---|
| Topology | Point-to-point (master ↔ one slave) | **Point-to-multipoint** (master ↔ all slaves) |
| Slots | **Reserved at regular intervals** (2 consecutive, symmetric) | Any **unreserved** slot, per-slot polling |
| Bandwidth | **Guaranteed** fixed rate | **No reservation** (packet-switched) |
| Retransmission | **Never** | **Yes** (ARQ) |
| Typical traffic | **Time-bounded voice** | **Data** |
| Max number | Master: 3 SCO links | **One** ACL link |
[BT-B]

**C4. Compare ASK, BFSK and BPSK in terms of noise immunity and bandwidth. (6)**
**ASK**: data in amplitude; **most susceptible to noise** and sudden gain changes; bandwidth ∝ baud rate. **BFSK**: data in frequency; **less error-prone than ASK**; **needs more bandwidth** (two carriers separated by 2Δf). **BPSK**: data in phase (0°/180°); **less susceptible to noise than ASK** (noise changes amplitude more easily than phase); **same bandwidth as ASK, less than BFSK**; needs more sophisticated hardware [SE; WC-S 59–64].

---

## SECTION D — Calculation and problem-solving questions

**D1. Hamming code. Encode the data byte 10110011 using an even-parity Hamming code (positions numbered from 1 at the left, check bits at 1, 2, 4, 8). (a) How many check bits? (b) Calculate each check bit. (c) Write the codeword. (8)**
**(a)** 2^r ≥ m + r + 1 with m = 8: r = 3 gives 8 < 12 ✘; r = 4 gives 16 ≥ 13 ✔ → **4 check bits** (12-bit codeword).
**(b)**
| Pos | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| | P1 | P2 | 1 | P4 | 0 | 1 | 1 | P8 | 0 | 0 | 1 | 1 |
- P1 (3, 5, 7, 9, 11) = 1, 0, 1, 0, 1 → three 1s → **1**
- P2 (3, 6, 7, 10, 11) = 1, 1, 1, 0, 1 → four 1s → **0**
- P4 (5, 6, 7, 12) = 0, 1, 1, 1 → three 1s → **1**
- P8 (9, 10, 11, 12) = 0, 0, 1, 1 → two 1s → **0**
**(c)** Codeword = **1 0 1 1 0 1 1 0 0 0 1 1 = 101101100011**.

**D2. Hamming error correction. The 12-bit codeword 101101100011 (from D1) is received as 101101101011. Find and correct the error. (4)**
Received: positions 1–12 = 1 0 1 1 0 1 1 0 **1** 0 1 1 (bit 9 changed).
- C1 (1, 3, 5, 7, 9, 11) = 1, 1, 0, 1, 1, 1 → five 1s → fails → **1**
- C2 (2, 3, 6, 7, 10, 11) = 0, 1, 1, 1, 0, 1 → four 1s → OK → **0**
- C4 (4, 5, 6, 7, 12) = 1, 0, 1, 1, 1 → four 1s → OK → **0**
- C8 (8, 9, 10, 11, 12) = 0, 1, 0, 1, 1 → three 1s → fails → **1**
Syndrome C8C4C2C1 = **1001 = 9** → **bit 9 is wrong** → flip it → **101101100011** ✔.

**D3. CRC. Data 1101011011, generator x⁴ + x + 1. Find the transmitted frame. (8)**
- G = x⁴ + 0x³ + 0x² + x + 1 = **10011** (r = 4); append 0000 → **11010110110000**.
- Division (5-bit windows):
  1. 11010 ⊕ 10011 = 01001
  2. 10011 ⊕ 10011 = 00000
  3. 10110 ⊕ 10011 = 00101
  4. 10100 ⊕ 10011 = 00111
- **Remainder = 1110** → **transmitted frame = 1101011011 1110**.
- Check: dividing 11010110111110 by 10011 gives remainder 0000 ✔.

**D4. CRC. Data 100100, generator 1101. Find the CRC and the transmitted string. (6)**
Append 000 → 100100000.
1. 1001 ⊕ 1101 = 0100
2. 1000 ⊕ 1101 = 0101
3. 1010 ⊕ 1101 = 0111
4. 1110 ⊕ 1101 = 0011
5. 1100 ⊕ 1101 = 0001
**Remainder = 001** → transmit **100100001**.

**D5. Internet checksum (4-bit words). Message 0110 1011 1001 0101. Find the checksum and show the receiver's check. (4)**
| Step | Addition | Raw | After end-around carry |
|---|---|---|---|
| 1 | 0110 + 1011 | 1 0001 | 0001 + 1 = **0010** |
| 2 | 0010 + 1001 | 1011 | **1011** |
| 3 | 1011 + 0101 | 1 0000 | 0000 + 1 = **0001** |
**Sum = 0001 → checksum = 1110.** Receiver: 0001 + 1110 = **1111** → no error.
(Decimal check: 6 + 11 + 9 + 5 = 31 = 2 × 15 + 1 → 0001 ✔.)

**D6. Free-space received power. A 2.4 GHz access point transmits 100 mW. Find the received power at 50 m in watts and dBm. (6)**
- λ = c/f = 3 × 10⁸ / 2.4 × 10⁹ = **0.125 m**
- 4πd/λ = 4π × 50 / 0.125 = **5026.5** → squared = **2.527 × 10⁷**
- Pr = Pt / (4πd/λ)² = 0.1 / 2.527 × 10⁷ = **3.96 × 10⁻⁹ W (3.96 nW)**
- In dBm: 10 log(3.96 × 10⁻⁹ / 10⁻³) = **−54.0 dBm**
(Equivalently, L_dB = 20 log f + 20 log d − 147.56 = 187.60 + 33.98 − 147.56 = 74.0 dB, and 20 dBm − 74 dB = −54 dBm ✔.)

**D7. Shannon capacity. A 20 MHz channel has SNR = 30 dB. Find the Shannon capacity. How many signal levels would Nyquist require for this rate? (6)**
- SNR = 10^(30/10) = **1000**
- C = B log₂(1 + SNR) = 20 × 10⁶ × log₂(1001) = 20 × 10⁶ × 9.967 = **199.3 Mbps** (≈ 200 Mbps)
- Nyquist: 199.3 × 10⁶ = 2 × 20 × 10⁶ × log₂M → log₂M = 4.98 → **M ≈ 32 levels**

**D8. FDMA channels. A system has Bt = 25 MHz, guard bands Bg = 100 kHz at each edge, Bc = 200 kHz. How many channels? If each channel carries 8 TDMA slots, how many users? (4)**
- N = (Bt − 2Bg)/Bc = (25 000 − 200)/200 = 24 800/200 = **124 channels**
- Users = 124 × 8 = **992** [MA p4, p6]

**D9. Scatternet probability. Three piconets share 80 frequencies (always transmitting, no CSMA, independent hops). What is the probability that a poll + reply transaction in piconet 1 suffers a collision? (6)**
- In one slot, piconet 1 avoids collision only if **both** other piconets choose a different frequency: (79/80)² per slot.
- The transaction needs 2 slots: P(success) = ((79/80)²)² = (79/80)⁴ = **0.9509**.
- **P(collision) = 1 − (79/80)⁴ ≈ 0.049 ≈ 4.9%**. Adding piconets increases collisions, as the notes say [BT-B].

**D10. Dijkstra. Using Figure 1 (the exam network), compute the shortest paths from u to all nodes. (8)**
Link costs: x–z 8, x–y 6, x–v 3, x–w 6, y–z 12, y–v 8, y–t 7, v–t 4, v–u 3, v–w 4, t–u 2, w–u 3.

| Step | N' | D(t),p | D(v),p | D(w),p | D(x),p | D(y),p | D(z),p |
|---|---|---|---|---|---|---|---|
| 0 | u | **2,u** | 3,u | 3,u | ∞ | ∞ | ∞ |
| 1 | ut | — | **3,u** | 3,u | ∞ | 9,t | ∞ |
| 2 | utv | — | — | **3,u** | 6,v | 9,t | ∞ |
| 3 | utvw | — | — | — | **6,v** | 9,t | ∞ |
| 4 | utvwx | — | — | — | — | **9,t** | 14,x |
| 5 | utvwxy | — | — | — | — | — | **14,x** |
| 6 | utvwxyz | — | — | — | — | — | — |

Updates: via t: y = 2 + 7 = 9 (v via t = 6 > 3). Via v: x = 3 + 3 = 6 (y via v = 11 > 9; w via v = 7 > 3). Via w: x via w = 9 > 6. Via x: z = 6 + 8 = 14 (y via x = 12 > 9).
**Results**: t 2 (u-t); v 3 (u-v); w 3 (u-w); x 6 (u-v-x); y 9 (u-t-y); z 14 (u-v-x-z).

**D11. Bellman-Ford. Node x has neighbours y (cost 2) and z (cost 7). y advertises D_y(z) = 1 and D_y(w) = 5; z advertises D_z(w) = 3. Compute D_x(z) and D_x(w). (4)**
- D_x(z) = min{ c(x,y) + D_y(z), c(x,z) + D_z(z) } = min{2 + 1, 7 + 0} = **3 (via y)**
- D_x(w) = min{ c(x,y) + D_y(w), c(x,z) + D_z(w) } = min{2 + 5, 7 + 3} = **7 (via y)**

**D12. Path loss. A 900 MHz cellular link has a receiver 2 km from the base station. Find the free-space path loss as a ratio and in dB. (4)**
- λ = 3 × 10⁸ / 9 × 10⁸ = **0.333 m**
- Lp = (4πd/λ)² = (4π × 2000 / 0.333)² = (75 398)² = **5.68 × 10⁹**
- L_dB = 10 log(5.68 × 10⁹) = **97.5 dB** (check: 20 log(9 × 10⁸) + 20 log(2000) − 147.56 = 179.08 + 66.02 − 147.56 = 97.5 ✔)

---

## SECTION E — Application and scenario questions

**E1. A university library's WiFi slows down every lunchtime, and users report many retransmissions. The APs use 2.4 GHz channel 6. A staff kitchen with microwave ovens is next door. Diagnose and recommend. (10)**
- **Diagnosis**: microwave ovens radiate around **2.45 GHz** in the same **ISM band** as 2.4 GHz WiFi [WCP §10]. At lunchtime the ovens cause **inward/co-channel interference**, which **raises the bit error rate**. Corrupted frames are not ACKed, so stations retransmit and back off (CSMA/CA), and throughput falls [WL 27, 33]. ISM users have **no regulatory protection** [WC-S 10].
- **Recommendations**: (1) move the APs to the **5 GHz band** (less crowded, no ovens) [WL 23]; (2) change the 2.4 GHz channel to one away from the oven's emissions (e.g. channel 1); (3) **relocate APs** away from the kitchen or add **shielding**; use **directional antennas** pointing away; (4) **add APs / reduce cell size** so clients have a stronger signal (higher SINR); (5) allow **rate adaptation** and **fragmentation** (smaller frames are less likely to be hit) [FZ]; (6) **verify** with a spectrum analyser before and after.

**E2. Five laptops in a meeting room with no AP want to share files. Which 802.11 architecture applies? What limitation do they face? (4)**
An **ad hoc BSS (independent BSS)**: stations form a network **without an AP**, locating each other and agreeing to be part of a BSS [FZ]. **Limitations**: it is a **stand-alone network that cannot send data to other BSSs** or the Internet [WL 10; FZ]. Stations communicate only if **within each other's range** (or if others forward) [WL 9]. PCF is not available (infrastructure only) [WL 40].

**E3. A pedestrian (Tc ≈ 70 ms) and a car on the highway (Tc ≈ 5 ms) both use a 1 kbps telemetry link. Classify the fading for each. (4)**
Bit time Tb = 1/1000 = **1 ms**.
- **Pedestrian**: Tc = 70 ms ≫ 1 ms → **slow fading** (the channel hardly changes during a bit).
- **Car**: Tc = 5 ms, which is only 5× Tb, **not much greater** → by the notes' definition it is treated as **fast fading** [WC-B 5.3].

**E4. A mobile user moves to the cell edge in an LTE network. Using your OFDMA notes, explain how the scheduler can still serve this user fairly. (6)**
Pure efficiency scheduling would favour users with the **highest SINR**, starving cell-edge users [OF]. **Proportional fairness** compares each user's **achievable rate now (rᵢ) to its own average rate (r̄ᵢ)**: the metric is rᵢ/r̄ᵢ. When the edge user's channel momentarily improves **relative to its own average**, its metric rises and it is scheduled, even if its absolute rate is lower than central users'. Subchannel choice (adjacent blocks matched to good frequencies), **AMC** and higher power on its subchannels also help. In the uplink, **subchannelization concentrates the device's power** on its allocated subchannels [OF §8.2].

---

## SECTION F — Long-form examination questions

**F1. "Wireless channels are hostile." Discuss the main impairments of the wireless channel and the mechanisms modern systems use to overcome them. (20)**
*Model answer outline (≈ 1 mark per developed point):*
1. **Introduction (2)**: the wireless channel is shared, time-varying and unpredictable. The received signal differs from the transmitted one because of impairments, causing random degradation (analog) or bit errors (digital) [WC-B 5.2].
2. **Impairments (9)**:
   - **Free-space loss/path loss**: (4πd/λ)²; path loss exponent n [WC-S 30–34].
   - **Noise**: thermal (irreducible), intermodulation, crosstalk, impulse (the main digital error source) [WC-S 36–38].
   - **Atmospheric absorption and refraction** [WC-S 39].
   - **Multipath** via reflection, diffraction and scattering → **destructive addition (20–30 dB)** and **ISI** [WC-B 5.3].
   - **Fading**: large-scale (shadowing) and small-scale; **fast/slow** (coherence time) and **flat/frequency-selective** (coherence bandwidth); Rayleigh/Rician [WC-B 5.3].
   - **Interference**: co-channel and adjacent channel; the unprotected ISM band [WCP §10].
3. **Mechanisms (8)**:
   - **FEC** (redundancy; ARQ is impractical) [WC-S 45].
   - **Adaptive equalization** (combats ISI) [WC-S 47].
   - **Diversity** (space, frequency, time; selection or combining) [WC-S 48].
   - **MIMO**: diversity, beamforming, MU-MIMO, multilayer [WC-B 5.4].
   - **AMC** (adapt hundreds of times per second) [WC-S 51].
   - **OFDM** (long symbols, selective fading on few subcarriers) [OF].
   - **Spread spectrum** (100× bandwidth, anti-interference) [SS].
   - **Bandwidth expansion** (carrier aggregation, reuse, mmWave) [WC-S 52].
4. **Conclusion (1)**: real systems **combine** all of these (e.g. LTE and 802.11ac use OFDM + MIMO + AMC + FEC) [WC-B 5.4].

**F2. Discuss medium access control in IEEE 802.11. Include the reason CSMA/CD is not used, DCF with RTS/CTS and NAV, the role of IFS, PCF, and the hidden and exposed station problems. (20)**
*Outline*:
- MAC functions: reliable delivery, access control, security [WL 27] (2)
- Why not CSMA/CD: three reasons [WL 29] (3)
- DCF/CSMA/CA steps: sense, DIFS, backoff (freeze), RTS/CTS/DATA/ACK with SIFS, no ACK → backoff and retry [WL 32–35] (5)
- NAV and collisions during handshaking [WL 37–38] (2)
- IFS: SIFS < PIFS < DIFS and the priority each gives [WL 34] (2)
- PCF: AP polling, PIFS priority, infrastructure only, superframe, single point of failure [WL 40–42] (3)
- Hidden station (CTS solves it) and exposed station (not solved) [FZ] (3)

**F3. Bluetooth is described as robust, low-power and low-cost. Explain how its architecture and protocols achieve these goals. (15)**
*Outline*:
- **Robustness**: FHSS at 1600 hops/s over 79 channels (resists interference and multipath); adaptive FH; 1/3 and 2/3 FEC; CRC + ARQ; HEC; SEQN duplicate filtering [BT-B; BT-S 45–50] (5)
- **Low power**: short range (10 m), power classes and **power control via LMP**, TDD on one chip, BLE (10 mW, long battery life) [BT-B; BT-S 53–55] (5)
- **Low cost**: one-chip transceiver (TDD prevents crosstalk), unlicensed ISM band, reuse of adopted protocols (PPP, TCP/IP, OBEX), profiles so devices implement only what they need, single-mode BLE chips [BT-B] (5)

**F4. Discuss routing in mobile ad hoc networks: why it is hard, the three categories of protocols with examples, and how distance-vector problems such as count-to-infinity are avoided in DSDV and AODV. (20)** *(SUPPLEMENTARY)*
*Outline*: challenges (6: mobility, no infrastructure, bandwidth, energy, unreliable links, security); proactive (4: DSDV, OLSR); reactive (4: AODV, DSR; RREQ/RREP/RERR); hybrid (3: ZRP); loop avoidance (3): **destination sequence numbers** in DSDV and AODV mark route freshness, so a node never accepts an older (stale) route. This prevents the stale-route loops behind count-to-infinity.
