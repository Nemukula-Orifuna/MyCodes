# Part 8 — Final Examination Revision Guide

Use this as your **last-week and night-before** document. Every item points back to the full notes (Parts 1–3) and answers (Parts 5–6).

---

## A. High-priority topics (from the counted patterns in Part 4)

| Priority | Topic | Why | Where |
|---|---|---|---|
| ★★★ | **Bluetooth Q-bank**: profiles, master vs AP, two piconets, hidden terminal, scatternet probability | Exam Q4 (20 marks) + Tests; profiles asked **4 times** | Part 3 §10; Part 5 Q4 |
| ★★★ | **802.11 MAC scenarios**: hidden node and CSMA/CA (Figure 2), ACKs, two ISPs channel 11 / 1 + 11 | Exam Q5 (18 marks); ISP question asked **3 times** | Part 3 §9; Part 5 Q5 |
| ★★★ | **Routing**: Dijkstra (Figure 1 from any node; new graphs), LS vs DV, Dijkstra vs BF, count-to-infinity, MANET categories | Exam Q2(d)+Q3 = **30 marks** | Part 3 §11; Part 5 Q2–3 |
| ★★★ | **Error coding calculations**: Hamming, CRC, checksum; parity vs bursts | In **every** paper except T1A | Part 2 §8 |
| ★★ | **Wireless channel**: path loss vs multipath vs interference; three propagation mechanisms; propagation problems; interference troubleshooting; distance calculation | Test 1 core; Exam Q1(a) | Part 1 §2 |
| ★★ | **Spread spectrum and CDMA**: FHSS/DSSS principles; CDMA anti-jamming | Asked **3 times each** | Part 2 §5–6 |
| ★★ | **OFDM/OFDMA**: three subcarrier approaches; OFDM vs OFDMA | Exam Q1(c), T1A, T1B | Part 2 §7 |
| ★★ | **Capacity and MIMO**: three ways to increase capacity; SU vs MU-MIMO; mobile node moving away | T1B, Exam Q5(a) | Part 1 §3 |
| ★ | Nyquist/Shannon, modulation, FDMA/TDMA formulas, generations, 802.15.3/.4, ZigBee, packet formats | In notes, never yet examined | Parts 1–3 |

---

## B. Essential definitions (reproduce these word-perfect)

| Term | Definition |
|---|---|
| Channel capacity | The maximum rate at which data can be transmitted over a given communication path, or channel, under given conditions |
| Bandwidth (effective) | The narrow band of frequencies in which most of the signal's energy is contained |
| SNR | Ratio of signal power to noise power at a point in the transmission; SNR_dB = 10 log₁₀(S/N) |
| Free space loss | Attenuation because the signal spreads over an ever-larger sphere with distance: Pt/Pr = (4πd/λ)² |
| Path loss exponent | Parameter describing how fast received power decreases with distance in an environment (n = 2 in free space) |
| Reflection | Occurs when a wave meets a surface **large** relative to its wavelength |
| Diffraction | Occurs at the **edge** of an impenetrable body large compared to the wavelength; secondary waves reach shadowed areas |
| Scattering | Occurs when obstacles are **on the order of the wavelength or smaller**; the signal splits into many weaker signals |
| Multipath | Multiple copies of a signal with varying delays received due to reflection/diffraction/scattering |
| ISI | Delayed copies of a pulse arrive with the primary pulse of a subsequent bit |
| Fading | Variation in received signal strength over time/position due to multipath, shadowing and movement |
| Flat vs frequency-selective fading | Flat: all frequency components fluctuate in the same proportion (Bc ≫ Bs). Selective: only part of the band is attenuated |
| Fast vs slow fading | Fast: coherence time not much greater than bit time. Slow: Tc ≫ Tb |
| FEC | Receiver corrects errors using only information in the received transmission (redundant bits) |
| Diversity | Providing multiple independent copies of the signal, because channels fade independently |
| MIMO | Multiple antennas at transmitter and receiver, used for diversity, beamforming, MU-MIMO, multilayer transmission |
| AMC | Dynamically adjusting modulation and coding rate to current channel conditions |
| Multiple access | Many users sharing finite spectrum simultaneously and efficiently, to maximise capacity |
| FDMA / TDMA / CDMA / SDMA | Divide by frequency (+ guard bands) / time slots / codes over the whole band / space (beams, sectors, reuse) |
| Spread spectrum | Expanding bandwidth B to Bss ≫ B with a pseudorandom code independent of the signal, for privacy and anti-jamming |
| FHSS | Carrier hops among M frequencies selected by a pseudorandom k-bit pattern each hop period |
| DSSS | Each data bit is replaced by n chips; chip rate = n × bit rate |
| OFDM | Multicarrier modulation: data split into N lower-rate streams on orthogonal subcarriers, all from one source |
| OFDMA | FDMA + TDMA on OFDM: users get subsets of subcarriers (subchannels) at different times |
| SC-FDMA | OFDMA-like scheme with an extra DFT; lower PAPR; LTE uplink |
| Single-bit / burst error | One bit changed / two or more bits changed; burst length from first to last bad bit |
| BSS / ESS | Stations + optional AP / two or more BSSs with APs joined by a distribution system |
| CSMA/CA | Sense, wait DIFS, random backoff, optional RTS/CTS, data, ACK |
| NAV | Timer from RTS/CTS durations telling stations how long to wait before checking the channel |
| Hidden station | Two stations out of each other's range both transmit to a common receiver, causing a collision there |
| Exposed station | A station refrains from transmitting although its transmission would not cause a collision |
| Piconet / scatternet | 1 master + ≤ 7 active slaves / overlapping piconets sharing area and bandwidth |
| Profile | A set of protocols implementing a particular Bluetooth application; a standard of interoperability |
| Routing / forwarding / switching | Network-wide path selection / router-local input→output move by destination IP / layer-2 frame move by MAC address |
| Count-to-infinity | DV routing loop where estimates rise slowly after bad news ("bad news travels slowly") |

---

## C. Formulas and procedures

### C1. Formula sheet
| Formula | Use when |
|---|---|
| **T = 1/f; λ = c/f** (c = 3 × 10⁸ m/s) | Period, wavelength |
| **C = 2B log₂M** (Nyquist) | Max bit rate, **noiseless** channel; or find M |
| **C = B log₂(1 + SNR)** (Shannon) | Max bit rate, **noisy** channel. **SNR as a ratio** |
| **SNR_dB = 10 log₁₀(S/N); S/N = 10^(dB/10)** | dB conversion |
| **Pt/Pr = (4πd/λ)² = (4πfd/c)²** | Free-space loss, power, distance, frequency |
| **Pr = Pt/(4πd/λ)²; d = (λ/4π)√(Pt/Pr); f = c√Lp/(4πd)** | Rearrangements |
| **L_dB = 20 log f + 20 log d − 147.56** | Free-space loss in dB (f in Hz, d in m) |
| **SNR = Pr/Pn; Lp = Pt/Pr** | WCP equations 2.2–2.3 |
| **Tc = 0.423c/(vf)** | Coherence time |
| **N = (Bt − 2Bg)/Bc** | FDMA channels |
| **Users = channels × slots per channel** | TDMA users |
| **S = N/r, r = log₂L** | Baud vs bit rate |
| **fᵢ = fc + (2i − 1 − M)fd** | MFSK frequencies |
| **2^r ≥ m + r + 1** | Hamming check bits |
| **P(collision) = 1 − (1 − 1/F)^(2k)** | Scatternet: F frequencies, k other piconets, 2 slots per poll+reply (k = 1, F = 80 → 2.5%) |
| **rᵢ / r̄ᵢ** | Proportional fairness metric |
| **dₓ(y) = minᵥ{c(x,v) + dᵥ(y)}** | Bellman-Ford |

### C2. Procedures (step lists)
**Hamming (even parity, 8 data bits)**
1. Inequality: r = 4 (16 ≥ 13).
2. Positions 1–12; P at 1, 2, 4, 8; data in 3, 5, 6, 7, 9, 10, 11, 12 left to right.
3. P1: 3, 5, 7, 9, 11 · P2: 3, 6, 7, 10, 11 · P4: 5, 6, 7, 12 · P8: 9, 10, 11, 12. Each = XOR of its bits (make the group's 1-count even).
4. Write the 12-bit codeword. To correct: recompute checks, read C8C4C2C1 as the bad-bit position.

**CRC**
1. G bits from the polynomial (degree r = length − 1).
2. Append r zeros.
3. XOR-divide: whenever the leading bit is 1, XOR with G; otherwise bring down.
4. The last r bits = remainder = CRC; transmit data + CRC.
5. Receiver: divide the whole frame; remainder 0 = OK, non-zero = error.

**Internet checksum (k-bit words)**
1. Add words one at a time; if a carry exits the top bit, **wrap it around** (add 1).
2. Checksum = **complement** of the final sum.
3. Receiver: add everything including the checksum → **all 1s** = OK.

**Dijkstra**
1. Table: Step | N' | D(n),p(n) for every node.
2. Initialise with the source's neighbours; others ∞.
3. Repeat: add the min-D node to N'; relax its neighbours (D = min(D, D(w) + c)).
4. Show every row; mark settled nodes "—".
5. Finish with a table of cost + full path (+ first hop). **Mention ties.**

**Free-space problems**
1. Convert units. 2. λ = c/f. 3. Choose the rearrangement. 4. Compute carefully (square root before dividing). 5. Units and a sanity check.

---

## D. Frequently repeated questions: exam-ready short answers

**D1. Profiles as an advantage (asked 4×).** Interoperability across vendors (the stated purpose of profiles); a ready-made recipe of mandatory/optional features for each usage model; reuse of protocols and other profiles (e.g. File Transfer uses OBEX/RFCOMM/L2CAP + Generic Access); devices implement only the profiles they need (cheap, low power); consistent discovery, connection and security via the Generic Access Profile and SDP.

**D2. Path loss vs multipath vs interference (3×).** Path loss: deterministic power decrease with distance and frequency, (4πd/λ)²; fix with power, antennas, more APs. Multipath: own signal arrives via reflection/diffraction/scattering with different delays; random fading and ISI; fix with equalization, diversity, OFDM. Interference: other transmitters (co-/adjacent-channel, microwave ovens); fix with channel planning, spread spectrum, directional antennas.

**D3. FHSS and DSSS (3×).** SS expands B → Bss ≫ B with a pseudorandom code independent of the signal. FHSS: PN generator → frequency table → synthesizer; the carrier hops among M = 2ᵏ frequencies every hop period; a jammer hits only one hop. DSSS: each bit → n chips (Barker 11: 10110111000); bandwidth × n; privacy and interference immunity.

**D4. CDMA and jamming (3×).** All users share the whole band all the time, separated by unique pseudorandom codes at the chip rate; the correlator despreads the wanted signal; others stay as noise; power control. Hard to jam: wide band and low power density; despreading spreads and filters out the jammer; the code is unknown; designed for anti-jamming (WWII).

**D5. Two ISPs on channel 11 / channels 1 and 11 (3×).** Ch 11: no breakdown; one shared collision domain; CSMA/CA makes them defer to each other; simultaneous transmissions collide, no ACK, backoff and retransmit; each gets about half the throughput. Ch 1 + 11: non-overlapping, independent; simultaneous transmissions succeed; each gets the full channel.

**D6. CRC (3×).** See procedure C2. Past answers: 101110/1001 → **011**; 110101/1011 → **111**; 10011010/1101 → **101** (leftmost flip → remainder 101 ≠ 0).

**D7. Master of two piconets (3×).** No: the master's address and clock define the hop sequence and timing, so both would be the same piconet. A device can be slave/slave or master/slave.

**D8. Scatternet probability (3×).** 1/80 per slot; poll + reply need 2 clean slots: 1 − (79/80)² ≈ **2.5%**.

**D9. Master vs AP (3×).** Master polls (no contention), sets the hop sequence, ≤ 7 slaves, relays inside the PAN. AP: stations contend with CSMA/CA (PCF optional), and the AP bridges to the wired network / other networks.

**D10. Three propagation mechanisms (2×).** Reflection (large surfaces; ground reflection may cancel LOS); diffraction (sharp edges; reaches shadow areas); scattering (small objects; many weak signals, unpredictable). Without LOS, diffraction and scattering dominate.

**D11. OFDMA approaches (2×).** Adjacent: equal SINR, choose the best block per user (needs full CSI). Regular: frequency diversity, low estimation burden. Random: diversity + reduced adjacent-cell interference.

**D12. Hidden node, Figure 2 (2×).** A and C can't hear each other but both reach B; both sense idle, transmit, collide at B; undetected; no ACKs; backoff and retransmit; capacity lost.

**D13. CSMA/CA, Figure 2 (2×).** A: NAV/sense → DIFS → backoff → RTS → B: CTS (C hears it, sets NAV) → A: DATA → B: ACK (each after SIFS). No CTS/ACK → backoff and retry.

**D14. ACKs (2×).** Ethernet detects collisions; no collision = implicit success. 802.11 can't detect collisions (half duplex, hidden stations, fading) and has high error rates, so it needs explicit ACKs.

**D15. Mobile node moving away (2×).** Increase transmit power; lower the rate / more robust modulation and coding (AMC).

**D16. Interference troubleshooting (2×).** Characterise → spectrum survey → locate the source → remove/relocate/shield → change channel/band → better antenna placement, directional antennas → raise SINR → robust techniques (SS, FEC, AMC) → more APs → verify.

**D17. Hamming (2×).** 10101111 → **101001001111**; 11001010 → **001110001010**.

**D18. Checksum (2×).** 1001 1100 1010 0011 → **1011**; 1010 1100 0110 1001 → **1000** (receiver sum 1111).

**D19. Parity (2×).** Detects all single-bit (odd) errors; misses even-numbered errors (bursts); cannot correct.

**D20. MANET categories (2×).** Proactive/table-driven (DSDV, OLSR); reactive/on-demand (AODV, DSR); hybrid (ZRP). Hard because of mobility, no infrastructure, bandwidth, energy, unreliable links.

**D21. Dijkstra Figure 1 (2×).** From x: v3 u6 w6 y6 t7 z8. From t: u2 v4 w5 x7 y7 z15. From w: u3 v4 t5 x6 y12 z14.

**D22. Count-to-infinity (2×).** DV loop after bad news, slowly counting up. A cost decrease or a new link: no, because good news travels fast.

**D23. Hidden terminal in Bluetooth (2×).** No within a piconet: master polling, slaves transmit only when addressed.

---

## E. Common mistakes (and how to avoid them)

1. **Putting dB into Shannon.** Convert first: 24 dB → 251, not 24.
2. **Mixing Pt in watts with path loss.** Lp = Pt/Pr is a **ratio** (e.g. 125 × 10³), not 125 × 10⁻³ (your notes contain this exact slip).
3. **Forgetting to square-root** when solving (4πd/λ)² = Lp for d, or to **square** when finding Lp.
4. **Units**: mW → 10⁻³, µW → 10⁻⁶, MHz → 10⁶, km → 10³. Write them every time.
5. **CRC: appending the wrong number of zeros.** Append **degree** = (number of bits in G) − 1, not the number of bits in G.
6. **CRC: doing ordinary subtraction.** It is **XOR**: no borrows.
7. **CRC: writing only the remainder** when asked for the transmitted string. Give **data + remainder**.
8. **Checksum: forgetting the end-around carry**, or forgetting to **complement** the sum.
9. **Hamming: using 3 check bits for 8 data bits.** Always test the inequality: 2³ = 8 < 12.
10. **Hamming: mixing up the coverage sets.** P4 covers 4–7 and 12; P8 covers 8–12.
11. **Parity: saying it "corrects" errors or detects all bursts.** It detects only odd numbers of errors and corrects none.
12. **Dijkstra: skipping rows or not showing predecessors.** Marks are for the step-by-step table. Remember G = 5 via E (not 6 direct) in T2-2026, and the **ties** (y from w; C from A).
13. **Dijkstra: forgetting to update** an already-labelled node when a cheaper path appears.
14. **Count-to-infinity: saying a cost decrease causes it.** It doesn't: good news travels fast.
15. **Hidden node: describing the exposed node instead** (or claiming RTS/CTS solves exposed stations).
16. **CSMA/CA: putting DIFS between RTS and CTS.** SIFS separates RTS–CTS–DATA–ACK; DIFS comes before contention.
17. **Two ISPs: saying 802.11 "breaks down".** It doesn't; the channel is shared and collisions increase.
18. **Bluetooth master: claiming it can master two piconets**, or that there are 8 slaves (it's 7 active slaves + 1 master).
19. **Scatternet probability: giving only 1/80.** The question stresses poll **and** reply, so use 1 − (79/80)², and you may mention 1/80 per packet.
20. **OFDM vs OFDMA: treating them as the same.** OFDM = modulation (one user); OFDMA = multiple access (many users).
21. **Saying 4G uses CDMA** (as one table in the notes does). LTE uses **OFDMA/SC-FDMA**.
22. **Three propagation mechanisms: listing "free space, transmission…".** In a **mobile system** the three are **reflection, diffraction, scattering**.

---

## F. Examination answering strategies

1. **Read the mark value and budget**: ~1 developed point per 1–2 marks; ~1 minute per mark (Test 2 2026: 50 marks in 60 minutes).
2. **Definition first**: open long answers with a one-sentence definition. It earns a mark and frames the answer.
3. **Use the lecturer's keywords**: "guard band", "chip rate", "pseudorandom", "NAV", "SIFS/DIFS", "piconet", "FH-TDD-TDMA", "orthogonal", "coherence time". Markers look for them.
4. **Tables for "compare/differences"**: 3–5 rows, then one sentence of conclusion.
5. **Name the nodes in scenarios**: "A sends RTS to B; C hears B's CTS and sets its NAV…". Don't just recite generic theory.
6. **Yes/No questions**: state Yes or No in the **first word**, then justify with the mechanism.
7. **Calculations**: write the **formula**, **substitute with units**, show **every** XOR/addition/table row, **box the final answer**, and add a one-line **check** (e.g. remainder 000; receiver sum 1111). State conventions (Hamming positions; tie-breaking).
8. **Dijkstra**: draw the full table; then a final table of cost + path. Mention equal-cost alternatives.
9. **Long essays (10–12 marks)**: intro → 4–6 headed points, each explained with "because…" → short conclusion.
10. **Answer the easy repeated questions first** (profiles, ISP, CRC, Dijkstra) to bank marks, then return to the rest.
11. **Never leave a calculation blank**: the method marks are available even if the arithmetic slips.

---

## G. Final revision checklist

Tick each item when you can do it **from memory**, without notes.

**Transmission and channel**
- [ ] T = 1/f, λ = c/f; analog vs digital signals; amplifier vs repeater
- [ ] Nyquist and Shannon; the 3–4 MHz, 24 dB → 8 Mbps → M = 16 example
- [ ] Ground / sky / LOS propagation modes with frequency ranges
- [ ] Five propagation mechanisms; **three mobile mechanisms explained**
- [ ] Free-space loss formula; **solve Test 1A Q14 (9.93 m)** and the WCP problems
- [ ] Path loss exponent table; four noise types
- [ ] Multipath effects; fading types (fast/slow, flat/selective, large/small scale)
- [ ] **Path loss vs multipath vs interference table**
- [ ] Ten wireless problems; **interference troubleshooting steps**; co-channel interference

**Correction, capacity and encoding**
- [ ] FEC vs ARQ; why ARQ is impractical; equalization; diversity types
- [ ] Four uses of MIMO; **SU-MIMO vs MU-MIMO**
- [ ] AMC; three bandwidth-expansion approaches; **three capacity methods**
- [ ] ASK/FSK/PSK/QPSK/QAM; baud vs bit rate; BER curves

**Multiple access, SS, OFDM**
- [ ] FDMA/TDMA/CDMA/SDMA: principle, pros, cons; **comparison table**; formulas
- [ ] **CDMA + why hard to jam**
- [ ] **FHSS and DSSS principles**; Barker code; FH-CDMA vs DS-CDMA
- [ ] OFDM orthogonality and benefits; **OFDM vs OFDMA**; **three OFDMA approaches**; proportional fairness; SC-FDMA
- [ ] 1G–5G key facts

**Error coding**
- [ ] Single-bit vs burst; burst length; **parity capabilities and limits**
- [ ] **Hamming** (inequality, positions, coverage, codeword, syndrome)
- [ ] **CRC** (append, XOR division, receiver check, polynomial ↔ bits)
- [ ] **Internet checksum** (end-around carry, complement, receiver 1111)

**WLAN**
- [ ] BSS/ESS/AP/SSID; infrastructure vs ad hoc; association
- [ ] Why no CSMA/CD (3 reasons); **CSMA/CA steps**; IFS; NAV; RTS/CTS
- [ ] **Hidden and exposed station** (with Figure 2); **ACKs**; PCF
- [ ] **Two ISPs (channel 11; channels 1 and 11)**; wired vs wireless LAN; design concerns
- [ ] 802.11 PHY variants (a/b/g/n)

**Bluetooth / 802.15**
- [ ] Stack layers and roles; RFCOMM, TCS BIN, adopted protocols
- [ ] **Profiles advantage**; piconet/scatternet; radio parameters; FH-TDD-TDMA
- [ ] SCO/eSCO/ACL; packet fields; 1/3 FEC, 2/3 FEC, ARQ
- [ ] **Master vs AP; two piconets; hidden terminal in BT; scatternet probability**
- [ ] BT 3.0 HS, BLE; 802.15.3 (PNC), 802.15.4, ZigBee devices and AODV

**Routing (supplementary)**
- [ ] Routing vs forwarding vs switching
- [ ] **Dijkstra tables** (Figure 1 from x, t, w, u; T2-2026 from A)
- [ ] LS vs DV; Dijkstra vs Bellman-Ford; Bellman-Ford equation
- [ ] **Count-to-infinity**, plus the cost-decrease and new-link cases
- [ ] Why MANET routing is hard; **proactive/reactive/hybrid with examples**

**Good luck. If you can tick every item, you can answer every question that has appeared in your past papers.**
