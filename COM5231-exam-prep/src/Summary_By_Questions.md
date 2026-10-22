# How to Use This Summary

This is the **whole module condensed into questions and answers**. Every past-paper question from all five papers (Exam, Test 1A, Test 1B, Test 2 2025, Test 2 2026) is here, plus the Bluetooth exercises and the worksheet. Repeated questions are **merged into one entry**, and the entry lists every paper that asked it. Each topic ends with the most likely questions that come from your notes but have not been asked yet.

**Key**
- **★★★** asked 3–4 times · **★★** asked twice · **★** asked once · **◇** not yet asked, but likely (from the notes)
- **Asked in** shows the paper and marks, e.g. *Exam 1(a) [6]*.
- **SUPPLEMENTARY** means the answer is not in your lecture notes (all of the routing material).
- Answers are written as **exam answers**. Expand each bullet into a full sentence in the exam, at roughly one point per 1–2 marks.

**Topics in order of exam weight** (the exam paper): Routing 30 · Bluetooth 20 · WLAN 18 · Error coding 10 · Wireless channel, spread spectrum, OFDMA, CDMA 20 · Capacity 2.

---

# 1. Wireless Channel and Propagation

## ★★★ What are the differences between path loss, multipath propagation and interference from other sources?
*Asked in: Exam 1(a) [6] · T1A Q3 [9] · T1B Q4 [12]*

| | **Path loss** | **Multipath propagation** | **Interference** |
|---|---|---|---|
| What | Drop in signal power from Tx to Rx | The **same** signal arrives by several paths with different delays and phases | Unwanted signals from **other** transmitters |
| Cause | Energy spreads over a growing sphere: **Pt/Pr = (4πd/λ)²**; absorption, obstruction | **Reflection, diffraction, scattering** off buildings, walls, ground, small objects | **Co-channel** (same channel: other WLANs, microwave ovens at 2.4 GHz), **adjacent-channel**, harmonics |
| Depends on | Distance and frequency (path-loss exponent n: 2 free space, 2.7–3.5 urban, 4–6 indoors) | Environment and **movement** | Other users' activity |
| Behaviour | **Predictable**, smooth | **Random, time-varying**: fading (20–30 dB dips), **ISI**, Doppler; strong but poor-quality signal | Random, bursty; lowers SINR |
| Effect | Weak signal, low SNR, limited range | Fading, ISI, distortion, higher BER | Bit errors, blocked transmissions |
| Fix | More power, antenna gain, **more APs** | **Equalization, diversity/MIMO, OFDM, spread spectrum**, lower data rate | **Channel planning**, spread spectrum, directional antennas, remove the source |

**For extra marks**: indoors, path loss grows about **20 dB per 100 ft**. Multipath is worst **indoors**. Interference acts **inward** (others affect us: co-channel) or **outward** (we affect others: adjacent channel).

## ★★ Explain the three basic propagation mechanisms in a mobile communication system.
*Asked in: T1A Q1 [12] · T1B Q3 [12]*
1. **Reflection**: occurs when the wave hits a surface **large compared with the wavelength** (ground, walls, buildings). The **ground-reflected wave can cancel the line-of-sight wave**, and many reflected copies add **constructively or destructively**.
2. **Diffraction**: occurs at the **sharp edge** of an impenetrable body that is large compared with λ. The edge acts as a **new source**, and **secondary waves** reach the **shadow** area, so a signal is received **with no LOS**.
3. **Scattering**: occurs when obstacles are **on the order of λ or smaller** and there are many of them (lamp posts, signs, foliage). The signal splits into **many weaker signals** and is **hard to predict**.
- **With LOS**, reflection dominates. **Without LOS** (urban street level), **diffraction and scattering** are the main means of reception. Together the three cause **multipath**.

## ★ What are the main problems of signal propagation? Why do radio waves not always follow a straight line? Why is reflection both useful and harmful?
*Asked in: T1A Q2 [12]*
- **Problems**: attenuation/free-space loss, noise (thermal, intermodulation, crosstalk, impulse), atmospheric absorption, multipath, fading, ISI, refraction, interference, shared medium and high BER.
- **Not straight**: **refraction** (speed changes with the density of the medium, so the wave bends; the ionosphere returns sky waves), **ground waves** follow the Earth's curvature, and **diffraction/scattering/reflection** redirect the signal.
- **Reflection is useful**: it reaches receivers **without line of sight**, and the extra copies can be **combined by diversity/MIMO**.
- **Reflection is harmful**: delayed, phase-shifted copies cause **destructive interference (fading)**, **ISI** and distortion.

## ★★ A wireless receiving site has occasional loss of signal due to interference. Discuss the steps you would take to correct it.
*Asked in: T1A Q12 [10] · T2-2025 Q6 [10]*
1. **Characterise** the problem: when, where, which channel. "Occasional" points to an intermittent source.
2. **Survey the spectrum** with a spectrum analyser or site-survey tool.
3. **Locate the source**: microwave ovens (2.4 GHz), cordless phones, Bluetooth, neighbouring APs, faulty equipment.
4. **Remove, relocate or shield** the source, or increase its separation from the receiver.
5. **Change the channel** to a clear, non-overlapping one (1, 6 or 11), or **move to 5 GHz**.
6. **Improve the antenna**: placement and height for LOS, **directional antennas**, **diversity**.
7. **Raise the SINR**: more wanted-signal power or antenna gain (within the legal limit).
8. **Use robust techniques**: **spread spectrum/adaptive hopping, FEC, AMC (lower data rate)**, ARQ.
9. **Add APs** or reduce cell size; coordinate channels with neighbouring networks.
10. **Verify and monitor** after each change.

## ★ Explain why many WiFi networks can have a high error rate caused by co-channel interference.
*Asked in: T1A Q13 [4]*
- The admin chooses each AP's channel, and **neighbouring APs often choose the same one**.
- 2.4 GHz has only **3 non-overlapping channels** (1, 6, 11) and is shared with ovens, Bluetooth and phones.
- ISM users have **no regulatory protection**, and co-channel signals add directly to the wanted signal, lowering the SINR.
- **Hidden stations** in other BSSs on the same channel cause collisions that CSMA/CA can't prevent. Result: lost frames, retransmissions, lower throughput.

## ★ A transmitter operates at 850 MHz with a power of 125 mW; the received power is 1 µW. What is the distance?
*Asked in: T1A Q14 [6] (= Problem 2.7 in your notes)*
1. Lp = Pt/Pr = 125 × 10⁻³ / 1 × 10⁻⁶ = **125 × 10³**
2. λ = c/f = 3 × 10⁸ / 850 × 10⁶ = **0.3529 m**
3. 125 000 = (4πd/0.3529)² → √125 000 = **353.55**
4. d = 353.55 × 0.3529 / 4π = **9.93 m**

*(Your notes print "125 × 10⁻³" in step 3. It must be **125 × 10³**.)*

## ◇ Likely questions from the notes
- **Three propagation modes?** Ground wave (< 3 MHz, follows the Earth, AM radio); sky wave (3–30 MHz, ionosphere, thousands of km); line of sight (> 30 MHz, satellite, most wireless).
- **Four types of noise?** **Thermal** (electron agitation, white, cannot be eliminated); **intermodulation** (sum and difference frequencies); **crosstalk** (unwanted coupling); **impulse** (spikes from lightning or faults; the main source of digital errors).
- **Types of fading?** **Large-scale** (shadowing, distance) vs **small-scale** (half-wavelength). **Fast** (coherence time Tc not ≫ bit time) vs **slow** (Tc ≫ Tb). **Flat** (coherence bandwidth ≫ signal bandwidth; all frequencies fade together) vs **frequency-selective** (only part of the band fades; needs an equalizer). **Rayleigh** (no LOS) vs **Rician** (LOS + scatter).
- **What are ISM bands?** Licence-free bands (915 MHz, 2.45 GHz, 5.8 GHz, 57–64 GHz), with power limits and spread spectrum required. **No protection** from interference.
- **Why is spectrum underused, and the fix?** Licensing. Dynamic spectrum access + cognitive radio (secondary users use idle primary spectrum). South Africa's regulator is **ICASA**.

---

# 2. Channel Correction, Capacity and MIMO

## ★★ As a mobile node moves farther from a base station, what two actions could the BS take so that frame loss does not increase?
*Asked in: Exam 5(a) [2] · T1A Q7 [4]*
1. **Increase transmit power**, to offset path loss (∝ d²) and keep the SNR up.
2. **Reduce the data rate**: use more robust modulation and stronger coding (**AMC / rate adaptation**), which needs a lower SNR.
*(Also valid: beamform toward the node.)*

## ★ Discuss three methods to increase the capacity of a wireless communication system.
*Asked in: T1B Q5 [12]*
1. **Frequency reuse / small cells (network densification, SDMA)**: reuse frequencies in cells far enough apart; femto- and picocells. Sectorization and beamforming allow tighter reuse (**7-cell → 4-cell pattern nearly doubles capacity**) and intracell reuse.
2. **MIMO**: **SU-MIMO** sends parallel streams (higher rate in the same bandwidth); **MU-MIMO** beams to several users at once (more users per cell); diversity and beamforming add quality and coverage.
3. **Bandwidth expansion**: **carrier aggregation** (20 → 40/80/160 MHz; LTE combines carriers) and **mmWave (30–300 GHz)**, which offers wide channels but suffers from obstructions.
*(Other valid choices: CDMA (4–5× the capacity of other digital systems), OFDMA, AMC.)*

## ★ What distinguishes single-user MIMO from multiple-user MIMO?
*Asked in: T1B Q9 [8]*

| | **SU-MIMO** | **MU-MIMO** |
|---|---|---|
| Who | All streams to **one user** | Beams to **several users simultaneously** |
| How | **Multilayer**: parallel streams on the same frequency and time | **Beamforming / SDMA** |
| Goal | **Higher data rate** for that user | **Higher capacity** (more users per cell) |
| Needs | Multiple antennas on the user device | Many antennas at the BS + knowledge of each user's channel |

## ◇ Likely questions from the notes
- **Why is backward error correction (ARQ) impractical in wireless?** In satellite links the delay is too long. In mobile links the error rates are so high that the retransmission also fails. So **FEC** is used (total bits/data bits = 2–3).
- **What is adaptive equalization?** It combats **ISI** by gathering dispersed symbol energy back into its time interval, using analog circuits or DSP.
- **Types of diversity?** **Space** (spaced antennas), **frequency** (OFDM, spread spectrum), **time** (interleaving, Rake receiver). Signals are used by **selection** or **combining**.
- **Four uses of MIMO?** Diversity (performance), beamforming (coverage), MU-MIMO (capacity), multilayer/SU-MIMO (data rate).
- **AMC?** Adapts modulation and coding to the channel hundreds of times per second. Needs **channel measurement** (pilots, loss rates) and **signalling** between Tx and Rx.
- **Three bandwidth expansion approaches?** Carrier aggregation, frequency reuse, mmWave.

---

# 3. Multiple Access and CDMA

## ★★★ Describe CDMA and explain why it is difficult to jam.
*Asked in: Exam 1(d) [4] · T1A Q6 [4] · T1B Q7 [10]*

**Description**
- **All users share the entire bandwidth all the time**, each separated by a **unique pseudorandom (orthogonal) code**.
- Data are **spread** by the code at a much higher **chip rate**. E.g. IS-95: 1.2288 Mchip/s, 1.25 MHz channel, up to 64 users.
- The signal sits **below the noise level**. The receiver's **correlator despreads** the wanted signal, which passes a narrowband filter; other users remain noise.
- **Power control** keeps everyone at minimum power. **Advantages**: 4–5× the capacity of other digital systems, **soft handoff**, simple frequency planning, privacy.

**Why it is hard to jam**
1. Energy is **spread over a wide band at low power density**, so a jammer must cover the whole band.
2. **Despreading spreads the jammer** (it lacks the code), and the narrowband filter removes most of it. This is the **processing gain** (≈ chip rate / bit rate).
3. The **code is unknown** to the jammer, so it cannot target the signal.
4. Spread spectrum was **designed** to suppress interference and resist interception; it was used in **WWII to foil enemy jamming**.

## ◇ Likely questions from the notes
- **FDMA**: frequency bands with **guard bands**; one user per channel 100% of the time; simple filters, no equalizer; wastes idle channels and guard bands. **N = (Bt − 2Bg)/Bc** (e.g. (25 000 − 200)/200 = 124 channels).
- **TDMA**: one frequency, time slots, **bursts**; needs **synchronisation and equalization**; better spectrum use, longer battery life, simple handoff, no duplexer; high peak power. **Users = channels × slots**.
- **SDMA**: separate users by **space** (beamforming, sectorization, frequency reuse). Benefits: range extension, interference suppression, multipath mitigation, capacity, compatibility.
- **Comparison of SDMA, TDMA, FDMA, CDMA**: separation by directed antennas / time sync / frequency filtering / codes + special receivers.
- **Generations**: 1G analog FDMA (2 kbps) → 2G digital GSM TDMA (64 kbps, SMS) → 3G CDMA/UMTS (2 Mbps, video calls) → 4G all-IP LTE (**OFDMA**, 100 Mbps–1 Gbps, MAGIC) → 5G (> 1 Gbps). *(The notes' table wrongly lists CDMA for 4G and 5G.)*

---

# 4. Spread Spectrum

## ★★★ Explain the spread spectrum principles of (i) FHSS and (ii) DSSS.
*Asked in: Exam 1(b) [4] · T1A Q4 [10] · T1B Q6 [10]*

**Principle**: expand bandwidth B to **Bss ≫ B** (redundancy), using a **pseudorandom spreading code independent of the signal**. The goals are **privacy and anti-jamming**, not bandwidth efficiency.

**(i) FHSS**
- A **PN code generator** produces a k-bit pattern each **hopping period**; a **frequency table** maps it to one of **M = 2ᵏ** carriers; a **frequency synthesizer** generates the carrier, which the data modulate.
- *Example*: M = 8, k = 3; the pattern 101, 111, 001, … selects 700, 900, 300 kHz, …; the sequence repeats after 8 hops.
- **Privacy**: an intruder catches only small pieces. **Anti-jam**: a jammer hits **one hop**, not the whole transmission. **M users** can share Bss (like FDM that changes every hop).

**(ii) DSSS**
- **Each data bit is replaced by n chips**; chip rate = **n × bit rate**, so the bandwidth grows n times.
- *Example*: the **Barker code, n = 11: 10110111000** (wireless LANs). A data 1 sends the code; a data 0 sends the inverted code.
- **Privacy** without the code; **immunity to interference**. Sharing the band requires **orthogonal codes (CDMA)**.

## ★ (Bluetooth exercise 15) How does FH-CDMA differ from DS-CDMA?
- **FH-CDMA**: users are separated by **different hop sequences**; occasional collisions on the same frequency (Bluetooth scatternets).
- **DS-CDMA**: users transmit **simultaneously over the whole band** with **different chip codes** and are separated by correlation (IS-95).

---

# 5. OFDM and OFDMA

## ★★ What are the benefits of each OFDMA approach: (i) adjacent, (ii) regularly spaced, (iii) randomly spaced subcarriers?
*Asked in: Exam 1(c) [6] · T1A Q5 [9]*
1. **Adjacent** (contiguous block): **all SINRs are about equal**, so the scheduler can **pick the best block for each user**, optimising efficiency, requirements, priority and fairness. It needs full-band channel knowledge (pilots, prediction). Used in LTE and WiMAX.
2. **Regularly spaced** (distributed/comb): **frequency diversity**, so enough good subcarriers whichever are chosen; **low channel-estimation burden**. Used in LTE.
3. **Randomly spaced**: the same **diversity**, **plus reduced adjacent-cell interference**. Used in WiMAX.

## ★ Describe the difference between OFDM and OFDMA.
*Asked in: T1B Q8 [10]*
- **OFDM**: a **modulation technique**. A stream of R bps is split into **N streams of R/N** on **orthogonal subcarriers** (spacing a multiple of 1/T; LTE uses 15 kHz). The spectra **overlap without interference** (≈ 6× FDM in the notes' example). Long symbols (N·Ts) **defeat ISI**, and frequency-selective fading hits only a few subcarriers. **One user uses all subcarriers.**
- **OFDMA**: a **multiple access scheme** = **FDMA + TDMA** on OFDM. **Users get subsets of subcarriers (subchannels / resource blocks of 12) at different times**, with opportunistic scheduling. In the uplink a user concentrates power on its own subchannels. Used in the **LTE downlink** and WiMAX.
- **Not all OFDM uses OFDMA**: 802.11a/g use OFDM with **CSMA** for access.

## ◇ Likely questions from the notes
- **Fundamental requirement of OFDM?** **Orthogonality**: the average of s₁·s₂ over a bit time = 0; subcarriers are multiples of fb = 1/T.
- **Main strengths?** Robust to frequency-selective fading, no ISI, often no equalizer, spectral efficiency.
- **Main problems?** **PAPR** (high peaks need expensive linear amplifiers) and **inter-carrier interference** (frequency offset, Doppler).
- **Purpose of SC-FDMA?** An extra **DFT** gives a single-carrier-like signal with **lower PAPR**: better battery life. Used on the **LTE uplink**; one user at a time.
- **Proportional fairness?** Schedule by **rᵢ / r̄ᵢ** (rate available now ÷ the user's own average), balancing efficiency against fairness.

---

# 6. Error Detection and Correction

## ★★ Hamming code: how many check bits, and what is the codeword?
*Asked in: Exam 2(a) [4] (data 10101111) · T2-2026 Q2 [8] (data 11001010)*

**Method**
1. **2^r ≥ m + r + 1**. For m = 8: r = 3 gives 8 < 12 ✘; r = 4 gives 16 ≥ 13 ✔ → **4 check bits, 12-bit codeword**.
2. Number positions 1–12 from the left. Check bits go in **1, 2, 4, 8**; data fill 3, 5, 6, 7, 9, 10, 11, 12.
3. **P1** covers 3, 5, 7, 9, 11 · **P2** covers 3, 6, 7, 10, 11 · **P4** covers 5, 6, 7, 12 · **P8** covers 9, 10, 11, 12. Even parity: each check bit makes its group's count of 1s even.

| Data | P1 | P2 | P4 | P8 | **Codeword** |
|---|---|---|---|---|---|
| 10101111 | 1 | 0 | 0 | 0 | **1010 0100 1111** |
| 11001010 | 0 | 0 | 1 | 0 | **0011 1000 1010** |

- **Correcting an error**: recompute the four checks and read them as **C8C4C2C1**; that number is the position of the bad bit.

## ★★★ CRC: find the transmitted bit string.
*Asked in: Exam 2(b) [4] · T1B Q2 [16] · T2-2026 Q3 [6]*

**Method**: generator bits from the polynomial → **append (degree) zeros** → **XOR-divide** → the remainder is the CRC → transmit **data + CRC**. The receiver divides the whole frame: **remainder 0 = OK**, non-zero = error.

| Question | G | Appended | XOR steps | **CRC** | **Transmit** |
|---|---|---|---|---|---|
| Exam 2(b): 101110 | 1001 | 101110**000** | 1011→0010, 1010→0011, 1100→0101, 1010→0011 | **011** | **101110011** |
| T2-2026 Q3: 110101 | 1011 (x³+x+1) | 110101**000** | 1101→0110, 1100→0111, 1111→0100, 1000→0011, 1100→0111 | **111** | **110101111** |
| T1B Q2: 10011010 | 1101 (x³+x²+1) | 10011010**000** | 1001→0100, 1001→0100, 1000→0101, 1011→0110, 1100→0001, 1000→0101 | **101** | **10011010101** |

- **T1B Q2(b)** (leftmost bit flipped): received **00011010101**, remainder **101 ≠ 0**, so an error is detected. A valid frame is always exactly divisible by G.
- **Why modulo-2?** Addition and subtraction become **XOR** with no carries or borrows, giving simple hardware (a shift register + XOR gates) and the mathematical basis of polynomials over GF(2).

## ★★ Internet checksum (4-bit words).
*Asked in: Exam 2(c) [2] · T2-2026 Q4 [4]*

**Method**: add the words; **wrap any carry** around (add it back in); the **checksum = complement** of the sum. The receiver adds everything, including the checksum, and gets **1111** if there is no error.

| Message | Running sums (after wrap) | Sum | **Checksum** |
|---|---|---|---|
| 1001 1100 1010 0011 (Exam) | 0110 → 0001 → 0100 | 0100 | **1011** |
| 1010 1100 0110 1001 (T2-2026) | 0111 → 1101 → 0111 | 0111 | **1000** (receiver: 0111 + 1000 = **1111**) |

## ★★ Single-bit vs burst errors, and how appropriate parity is.
*Asked in: T1B Q1 [10] · T2-2026 Q5 [3] + Q6 [5]*
- **Single-bit error**: only **one bit** changes. **Burst error**: **two or more bits** change. **Burst length** runs from the **first to the last corrupted bit**, inclusive (bits in between may be correct). Bursts dominate in wireless (impulse noise, fading).
- **Parity and single-bit errors**: **always detected**, because one flip makes the count of 1s odd. It is cheap (1 bit), so it suits isolated errors.
- **Parity and burst errors**: **not guaranteed**. Only an **odd** number of flips is caught; any **even** number passes unnoticed (about half of all bursts escape). So parity is **inappropriate for bursts**; use CRC (detects every burst of length ≤ r) or 2-D parity.
- **Can parity correct an error?** **No.** It cannot tell **which** bit changed.

---

# 7. Wireless LANs (IEEE 802.11)

## ★★ Use Figure 2 (A, B, C) to explain the hidden node problem. What happens when A and C send simultaneously?
*Asked in: Exam 5(b) [4] · T1A Q8 [4]; also T2-2025 Q4 [10]*
- **B is in range of both A and C**, but **A and C cannot hear each other**. A sending to B is inaudible to C, so C senses the channel as idle.
- **If A and C transmit at the same time**: both frames **collide at B**, which decodes neither. Wireless stations **can't detect the collision**, so both send their whole frames. There are **no ACKs**, both **back off and retransmit**, and **capacity is lost**.
- **Fix**: **RTS/CTS**. B's **CTS** reaches C, which defers.

## ★★ Use Figure 2 to explain how CSMA/CA works in 802.11 (A sends to B).
*Asked in: Exam 5(c) [4] · T1A Q9 [4]*
1. A checks its **NAV** and senses the channel. When idle, it waits **DIFS** and then a **random backoff** (the countdown freezes while the channel is busy).
2. A sends an **RTS** carrying the duration of the whole exchange.
3. After **SIFS**, B sends a **CTS** with the duration. **C hears the CTS and sets its NAV**, so the hidden node stays silent.
4. A sends **DATA** after SIFS; B sends an **ACK** after SIFS.
5. **No CTS or no ACK** means A assumes a collision, backs off and retries.
- **IFS priority**: **SIFS < PIFS < DIFS** (immediate responses < PCF polling < ordinary traffic).

## ★★ Why are acknowledgements used in 802.11 but not in wired Ethernet?
*Asked in: Exam 5(d) [2] · T1A Q10 [4]*
- **Ethernet (CSMA/CD)**: collisions are **detected**, so **no collision means implicit success**, and the cable has a low error rate.
- **802.11**: stations **cannot detect collisions** (they can't send and receive at once, there are hidden stations, and fading) and wireless frames are often lost to **noise, interference and fading**. The sender has **no other way to know the frame arrived**, so it needs an **explicit ACK**, with retransmission when none comes.

## ★★★ Two ISPs in a café, each with its own AP and IP block. (i) Both APs on channel 11? (ii) One on channel 1 and one on channel 11?
*Asked in: Exam 5(e) [4+4] · T1A Q11 [4+4] · T2-2025 Q10 [10+10]*

**(i) Both on channel 11**
- **No breakdown.** The two BSSs share **one collision domain**. CSMA/CA is distributed, so every station senses the channel and NAV and **defers to stations of both ISPs** (taking turns). IP blocks don't matter at the MAC layer.
- **Simultaneous transmissions** (same backoff slot, or hidden from each other) **collide**: no ACK, both **back off** (doubling the window) and **retransmit**.
- Result: more collisions, and **each ISP gets about half the throughput**.

**(ii) Channels 1 and 11**
- These are **non-overlapping channels** (50 MHz apart; each signal is about 22 MHz wide), so the BSSs are **independent**.
- Stations of different ISPs **don't hear or defer to each other**. **Simultaneous transmissions succeed** without collision.
- **Each ISP gets the full channel capacity**: aggregate throughput roughly doubles.

## ★ Compare wired and wireless LANs. What unique concerns must a WLAN designer address?
*Asked in: T2-2025 Q5 [10]*

| | Wired LAN | Wireless LAN |
|---|---|---|
| Medium | Wires | **Air, broadcast, shared** |
| Hosts | Fixed attachment | **Move freely** |
| Isolated LAN | Link-layer switch | **Ad hoc** (no AP) |
| To other networks | Router | **Access point** (joins wireless to wired) |
| Access | CSMA/CD | **CSMA/CA** |
| Channel | Clean | Attenuation, interference, multipath, **high error rate** |
| Moving between them | Change the NICs and swap the switch for an AP: **MAC addresses change, IP addresses stay the same** | |

**Unique concerns**: coverage and path loss; interference in the crowded ISM band (channel plan); multipath and fading; high error rate (ACKs, fragmentation); **hidden and exposed stations**; mobility and roaming; battery and power saving; **security and privacy**; licence-free power limits; QoS.

## ◇ Likely questions from the notes
- **Why can't WLANs use CSMA/CD?** (1) They can't send and receive at once (costly hardware, battery). (2) **Hidden stations** mean collisions go undetected. (3) **Fading** over distance hides collisions.
- **Exposed station problem?** C hears A sending to B and needlessly defers, although its own transmission to D wouldn't interfere. **RTS/CTS cannot fix it.**
- **NAV?** A timer set from the RTS/CTS duration field: **virtual carrier sense**.
- **PCF?** Optional, infrastructure-only **AP polling**; uses **PIFS** for priority over DCF; for time-sensitive traffic. If the AP fails, the system goes down.
- **BSS / ESS / SSID?** BSS = stations + optional AP (ad hoc if there is no AP). ESS = several BSSs joined by a distribution system. SSID = the network name. **Association**: scan for beacons, then request and response.
- **802.11 physical layers?** FHSS and DSSS (1–2 Mbps); infrared (PPM); **a** (OFDM, 5 GHz, 54 Mbps); **b** (HR-DSSS, 11 Mbps); **g** (OFDM, 2.4 GHz, 54 Mbps); **n** (MIMO, 600 Mbps). 2.4 GHz is more crowded; 5 GHz has shorter range but less interference. **Rate adaptation.**
- **Fragmentation?** On a noisy channel it is cheaper to resend a small frame than a large one.

---

# 8. Bluetooth and IEEE 802.15

## ★★★ Bluetooth profiles add significant complexity. How can they be an advantage to applications?
*Asked in: Exam 4(c) [4] · T2-2025 Q7 [10] · T2-2026 Q7 [4] · BT exercise 19*
1. **Interoperability**: a profile is a *"standard of interoperability so that products from different vendors… will work together"*. Any compliant headset works with any compliant phone.
2. **A ready-made recipe**: each profile states which protocols and features are **mandatory, optional or not applicable** for its usage model, so developers don't have to reinterpret the 2500-page core specification.
3. **Reuse**: profiles build on each other. E.g. the **File Transfer Profile** uses OBEX over RFCOMM and L2CAP, and depends on the Generic Object Exchange, Serial Port and **Generic Access** profiles.
4. **Only what's needed**: devices implement just their profiles, which makes them **cheaper, smaller and lower-power**.
5. **Consistent and plug-and-play**: all devices support the **Generic Access Profile** (discovery, connection, security), and **SDP** lets them find each other's services.

## ★★★ What are the differences between a Bluetooth master and an 802.11 base station / access point?
*Asked in: Exam 4(a) [4] · T2-2026 Q8 [4] · BT exercise 8*
- **Medium access**: the **master polls**. It sets the hop sequence and timing, and slaves transmit **only when addressed** (FH-TDD-TDMA), so there is **no contention**. In **802.11**, stations **contend with CSMA/CA**, collisions are possible, and polling (PCF) is optional.
- **Connecting to other networks**: the **AP links to other networks** (it bridges the BSS to the wired system or Internet) and relays all frames. The **master only sets up the piconet and relays traffic inside it**; there is no infrastructure gateway.
- **Scale**: the master serves **≤ 7 active slaves** over about 10 m. An AP serves many stations over tens to hundreds of metres.
- **Role**: any Bluetooth device can be master (a dynamic role); an AP is a dedicated device.

## ★★★ A Bluetooth device can be in two piconets. Can one device be the controller (master) of both at the same time?
*Asked in: Exam 4(d) [4] · T2-2025 Q9 [5] · BT exercise 9*
- **No.** A piconet is **defined by its master**: the **hopping sequence and timing** come from the **master's own address and clock**.
- If one device mastered both, they would use the **same hop sequence and timing**, so they would be **one piconet**, not two (and limited to 7 slaves).
- A device **can** be **slave + slave** or **master + slave**, time-sharing between the two piconets. That is how a scatternet works.

## ★★★ Scatternet of two piconets, no CSMA, 80 frequencies, always busy. Probability of collision (a success needs both the poll and the reply)?
*Asked in: Exam 4(e) [4] · T2-2025 Q8 [10] · BT exercise 20*
1. The piconets hop **independently**, so P(same frequency in a slot) = **1/80**.
2. P(a slot is clear) = **79/80**.
3. Poll + reply = **2 independent slots**, so P(success) = (79/80)² = **0.9752**.
4. **P(collision) = 1 − (79/80)² ≈ 0.025 = 2.5%** (it is 1/80 = 1.25% per single packet).

## ★★ Does the hidden terminal problem occur in Bluetooth?
*Asked in: Exam 4(b) [4] · T2-2025 Q4 [10]*
- **No, not within a piconet.** The hidden terminal problem needs **contention**: stations transmitting on their own after sensing an idle channel.
- In Bluetooth the **master polls**: a slave sends **only in the slot right after it is addressed**, and voice (SCO) slots are reserved. **Two slaves never start transmitting together**, so there is nothing to collide at the master.
- Collisions **between piconets** (the same hop in the same slot) are an FH-CDMA effect handled by FEC and ARQ, not a hidden-terminal problem.

## ★ Bluetooth exercises (quick answers)

| # | Question | Answer |
|---|---|---|
| 1 | Why a WPAN, not a WLAN? | ~10 m personal range, low power and cost, cable replacement, ≤ 8 active devices |
| 2 | Other name for Bluetooth Smart; which version? | **Bluetooth Low Energy (BLE)**, **v4.0** |
| 3 | How does 3.0 reach 24 Mbps? | **AMP**: uses an **802.11 (Wi-Fi) link** for data; Bluetooth handles discovery and setup |
| 4 | Piconet vs scatternet? | Piconet = 1 master + ≤ 7 slaves on one hop sequence. Scatternet = overlapping piconets that share area and bandwidth (FH-CDMA) |
| 5 | More than 8 stations? | Not active: the **3-bit AM_ADDR** allows 7 slaves + the master (more can be parked) |
| 6 | Master–slave relationship? | The master sets the hop sequence and timing; slaves talk only to the master, and only when polled |
| 7 | Link types? | **SCO** (reserved, symmetric, no retransmission, voice); **eSCO** (reserved, can be asymmetric, with retransmission); **ACL** (point-to-multipoint, packet-switched, retransmission) |
| 10 | Role of the radio layer? | The air interface: 2.4 GHz, 79 × 1 MHz channels, hopping, modulation, power classes |
| 11 | Actual bandwidth used? | **1 MHz** at a time; hops across ~79 MHz |
| 12 | Spread spectrum technique? | **FHSS, 1600 hops/s** (625 µs slots) |
| 13 | Modulation? | **GFSK** (1 = +deviation, 0 = −deviation, 1 Mbps); EDR uses π/4-DQPSK (2 Mbps) and 8DPSK (3 Mbps) |
| 14 | How are FH and TDD combined? | Each 625 µs slot is on the next hop frequency, and the direction alternates master→slave then slave→master |
| 16 | Interference from microwave ovens? | **Yes**: ovens use ~2.45 GHz. The effect is limited by hopping, adaptive hopping, and FEC/ARQ |
| 17 | Baseband MAC? | **TDMA with master polling (FH-TDD-TDMA)** |
| 18 | Role of L2CAP? | **Adapts upper-layer protocols to the baseband**; connectionless and connection-oriented services |

## ◇ Likely questions from the notes
- **Core protocols?** **Radio** (air interface) · **Baseband** (connections, addressing, packet format, timing, power control) · **LMP** (link setup, authentication, encryption) · **L2CAP** (adaptation) · **SDP** (service discovery). Plus **RFCOMM** (virtual serial port, RS-232), **TCS BIN** (call control) and adopted protocols (PPP, TCP/UDP/IP, OBEX).
- **Power classes?** Class 1: 100 mW (power control mandatory) · Class 2: 2.5 mW · Class 3: 1 mW.
- **Packet format?** Access code 72 bits · header 54 bits (18 × 3 for FEC: AM_ADDR 3, Type 4, Flow 1, ARQN 1, SEQN 1, HEC 8) · payload 0–2745 bits.
- **Error control?** **1/3 FEC** (each bit sent 3 times, majority vote; used on the header), **2/3 FEC** (Hamming (15,10): corrects 1 error, detects 2), **ARQ** (CRC, ACK/NAK, timeout).
- **Purposes of frequency hopping?** (1) Resistance to interference and multipath. (2) Multiple access between piconets. Adaptive hopping uses at least 20 channels.
- **Bluetooth Smart (BLE)?** 40 channels × 2 MHz (3 advertising + 37 data), 10 mW, 150 m, single-mode or dual-mode, aimed at the IoT.
- **802.15.3 PNC vs AP vs master?** The **PNC controls access to time but is not involved in data exchange between devices**; the AP links to other networks; the master relays all piconet traffic.
- **ZigBee device types?** **Coordinator** (one per network; starts it; holds security keys) · **Router** (relays) · **End device** (can't relay; sleeps; cheapest). Built on 802.15.4, 20–250 kbps, mesh, uses **AODV**.

---

# 9. Routing and Ad Hoc Networks (SUPPLEMENTARY: no notes provided)

## ★ Distinguish between routing, packet forwarding and switching: purpose and the information used.
*Asked in: T2-2026 Q1 [6]*

| | Purpose | Information used |
|---|---|---|
| **Routing** | Decide the **end-to-end path** across the network (control plane) | **Topology and link costs** from routing protocols, which build the forwarding table |
| **Forwarding** | Move a packet from **input to output link inside a router** | The packet's **destination IP address** + the **forwarding table** (longest-prefix match) |
| **Switching** | Move **frames** to the right port within a LAN (layer 2) | The **destination MAC address** + the **switch table** (self-learned) |

## ★★ Why is routing in ad hoc networks complicated? State and explain the three categories of MANET routing protocols, with examples.
*Asked in: Exam 2(d) [10] · T2-2025 Q1 [12]*

**Why it is complicated**: **mobility** (links keep breaking); **no infrastructure** (every node must route); **limited bandwidth**; **limited battery and CPU**; **unreliable links** (fading, hidden terminals, asymmetric links); multi-hop delay; security.

1. **Proactive (table-driven)**: keep routes to **all** destinations at all times through periodic updates. Routes are available **immediately**, but control overhead is **high and constant**. Examples: **DSDV**, OLSR.
2. **Reactive (on-demand)**: find a route **only when needed**. **Route discovery** floods a request and the destination replies; **route maintenance** repairs breaks. **Low overhead**, but a delay before the first packet. Examples: **AODV** (used by ZigBee), DSR.
3. **Hybrid**: **proactive within a nearby zone, reactive between zones**. Example: **ZRP**.

## ★ Compare and contrast link-state and distance-vector routing.
*Asked in: Exam 3(a) [4]*
- **Same**: both find least-cost paths, build forwarding tables, and adapt to changes.
- **Different**: link-state has **global** knowledge (flood link costs to **all**, run **Dijkstra**, **fast**, no loops, robust; e.g. OSPF). Distance-vector has **local** knowledge (send the vector to **neighbours** only, run **Bellman-Ford**, **slow**, loops, **count-to-infinity**, errors spread; e.g. RIP).

## ★ What is the essential difference between Dijkstra and Bellman-Ford?
*Asked in: Exam 3(b) [4]*
- **Dijkstra**: **global, greedy**. It needs the whole graph, **settles the nearest node permanently each step** (n steps), and requires non-negative costs.
- **Bellman-Ford**: **distributed, iterative**. It uses only **neighbours' estimates**, dₓ(y) = minᵥ{c(x,v) + dᵥ(y)}, and **relaxes repeatedly until convergence**. It handles negative costs, but converges slowly.

## ★★ Apply Dijkstra to Figure 1 (from x, t and w).
*Asked in: T2-2025 Q2 [8] (from x) · Exam 3(c) [4+4] (from t and w)*

**Figure 1 links**: x–z 8, x–y 6, x–v 3, x–w 6, y–z 12, y–v 8, y–t 7, v–t 4, v–u 3, v–w 4, t–u 2, w–u 3.
**Method**: draw a table of Step | N' | D(n),p(n). Each step, add the node with the smallest D to N' and update its neighbours with D = min(old, D(new) + cost).

**From x**

| Step | N' | t | u | v | w | y | z |
|---|---|---|---|---|---|---|---|
| 0 | x | ∞ | ∞ | **3,x** | 6,x | 6,x | 8,x |
| 1 | xv | 7,v | **6,v** | | 6,x | 6,x | 8,x |
| 2 | xvu | 7,v | | | **6,x** | 6,x | 8,x |
| 3 | xvuw | 7,v | | | | **6,x** | 8,x |
| 4 | xvuwy | **7,v** | | | | | 8,x |
| 5 | xvuwyt | | | | | | **8,x** |
**Result**: v 3 (x-v) · u 6 (x-v-u) · w 6 (x-w) · y 6 (x-y) · t 7 (x-v-t) · z 8 (x-z)

**From t**

| Step | N' | u | v | w | x | y | z |
|---|---|---|---|---|---|---|---|
| 0 | t | **2,t** | 4,t | ∞ | ∞ | 7,t | ∞ |
| 1 | tu | | **4,t** | 5,u | ∞ | 7,t | ∞ |
| 2 | tuv | | | **5,u** | 7,v | 7,t | ∞ |
| 3 | tuvw | | | | **7,v** | 7,t | ∞ |
| 4 | tuvwx | | | | | **7,t** | 15,x |
| 5 | tuvwxy | | | | | | **15,x** |
**Result**: u 2 (t-u) · v 4 (t-v) · w 5 (t-u-w) · x 7 (t-v-x) · y 7 (t-y) · z 15 (t-v-x-z)

**From w**

| Step | N' | t | u | v | x | y | z |
|---|---|---|---|---|---|---|---|
| 0 | w | ∞ | **3,w** | 4,w | 6,w | ∞ | ∞ |
| 1 | wu | 5,u | | **4,w** | 6,w | ∞ | ∞ |
| 2 | wuv | **5,u** | | | 6,w | 12,v | ∞ |
| 3 | wuvt | | | | **6,w** | 12,v | ∞ |
| 4 | wuvtx | | | | | **12,v** | 14,x |
| 5 | wuvtxy | | | | | | **14,x** |
**Result**: u 3 (w-u) · v 4 (w-v) · t 5 (w-u-t) · x 6 (w-x) · y 12 (w-v-y; **tie** with w-x-y and w-u-t-y) · z 14 (w-x-z)

## ★ Apply Dijkstra from A (T2-2026 figure); give the final costs and routes.
*Asked in: T2-2026 Q9 [6+4]*

**Links**: A–B 2, A–G 6, B–C 7, B–E 2, E–G 1, E–F 2, F–C 3, F–H 2, G–H 4, C–D 3, H–D 2.

| Step | N' | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|---|
| 0 | A | **2,A** | ∞ | ∞ | ∞ | ∞ | 6,A | ∞ |
| 1 | AB | | 9,B | ∞ | **4,B** | ∞ | 6,A | ∞ |
| 2 | ABE | | 9,B | ∞ | | 6,E | **5,E** | ∞ |
| 3 | ABEG | | 9,B | ∞ | | **6,E** | | 9,G |
| 4 | ABEGF | | 9,B | ∞ | | | | **8,F** |
| 5 | ABEGFH | | **9,B** | 10,H | | | | |
| 6 | ABEGFHC | | | **10,H** | | | | |

**Routes**: B **2** (A-B) · C **9** (A-B-C; tie with A-B-E-F-C) · D **10** (A-B-E-F-H-D) · E **4** (A-B-E) · F **6** (A-B-E-F) · (G 5 via E; H 8 via F)

## ★★ What is the count-to-infinity problem? Does it occur if a link cost decreases, or if two unlinked nodes are connected?
*Asked in: Exam 3(d) [4] · T2-2025 Q3 [5]*
- **What it is**: in distance-vector routing, **bad news travels slowly**. After a link cost rises or a link fails, a node adopts a neighbour's **stale** route that actually passes back through itself. This creates a **routing loop**: the estimates creep up step by step towards the true cost, or **towards infinity** if the destination is unreachable.
- *Example*: y–x 4, y–z 1, z–x 50, and the y–x cost changes to 60. y switches to the route via z (cost 6), z then goes via y (7), and so on: **44 iterations**, with packets looping meanwhile. Fixes: **poisoned reverse**, split horizon, a maximum hop count.
- **Link cost decreases**: **No**. Good news travels fast: lower costs propagate quickly and no loop forms.
- **Connecting two unlinked nodes**: **No**. This is the same as a cost falling from ∞ to a finite value, which is good news.

---

# 10. One-Page Formula and Method Sheet

| Formula / method | Use |
|---|---|
| T = 1/f · λ = c/f (c = 3 × 10⁸ m/s) | Basics |
| **C = 2B log₂M** | Nyquist (noiseless channel) |
| **C = B log₂(1 + SNR)**, with SNR = 10^(dB/10) | Shannon (noisy channel); **convert dB first** |
| **Pt/Pr = (4πd/λ)²** · Pr = Pt/(4πd/λ)² · d = (λ/4π)√(Pt/Pr) | Free-space power and distance |
| L_dB = 20 log f + 20 log d − 147.56 | Free-space loss in dB |
| SNR = Pr/Pn · Lp = Pt/Pr | Notes' equations 2.2 and 2.3 |
| N = (Bt − 2Bg)/Bc · users = channels × slots | FDMA and TDMA |
| S = N/r, r = log₂L | Baud rate vs bit rate |
| **2^r ≥ m + r + 1** | Number of Hamming check bits |
| CRC: append (degree) zeros, XOR-divide, send data + remainder | CRC |
| Checksum: add with wrap-around, then complement; receiver gets 1111 | Internet checksum |
| **1 − (79/80)²** | Scatternet collision probability |
| **dₓ(y) = minᵥ{c(x,v) + dᵥ(y)}** | Bellman-Ford |
| rᵢ / r̄ᵢ | Proportional fairness |

## Top 10 mistakes
1. Putting a dB value straight into Shannon's formula.
2. Writing 125 × 10⁻³ instead of the path-loss ratio 125 × 10³.
3. Appending the wrong number of CRC zeros (it must equal the generator's degree).
4. Using ordinary subtraction instead of XOR in CRC division.
5. Forgetting the wrap-around carry or the final complement in the checksum.
6. Using 3 check bits instead of 4 for an 8-bit Hamming code.
7. Saying parity corrects errors, or that it catches every burst.
8. Skipping Dijkstra rows, or forgetting to update a node when a cheaper path appears.
9. Saying 802.11 breaks down when both APs use channel 11.
10. Saying one device can be master of two piconets, or that a piconet has 8 slaves (it has 7 active slaves + 1 master).

## Exam technique
**Yes/No questions**: give the answer in the first word, then justify it. **Comparisons**: use a table. **Scenarios**: name the nodes (A, B, C). **Calculations**: write the formula, then each step, then the boxed answer, then a check. **Budget**: one point per 1–2 marks, about one minute per mark.
