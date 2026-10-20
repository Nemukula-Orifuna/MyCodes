# Overview — Document Inventory, Topic Outline and Study Plan

## A. What was analysed

All 23 files in *networking.zip* were opened and read. The scanned PDF and the image-only slide deck were read visually, page by page.

### Lecture notes (14 files)

| # | File | Main topics | Status |
|---|---|---|---|
| 1 | Chapter 2 Transmission Fundamentals.pptx (50 slides) | Signals, analog/digital, Nyquist, Shannon, media, FDM/TDM. Slide 1 = **COM5231 course outline** | Read (formula slides are images; the PDF has the same example) |
| 2 | CHAPTER 2 Transmission Fundamentals_1.pdf (28 pp) | Textbook version of #1 with derivations | Read |
| 3 | The Wireless Channel.pptx (74 slides) | Spectrum/ISM/ICASA, propagation, antennas, free-space loss, path-loss exponent, noise, fading, channel correction, ASK/FSK/PSK, BER, review questions | Read |
| 4 | Wireless Communication.pdf (19 pp) | Textbook Ch. 5: detailed version of #3 | Read |
| 5 | Wireless Communication Problems.pdf (8 pp) | Ten wireless problems; worked power/distance/SNR calculations | Read (3 errors found, see Part 1) |
| 6 | Multiple access techniquesV2.pdf (31 pp, scanned) | FDMA, TDMA, CDMA, SDMA, comparison table, 1G–5G | Read visually |
| 7 | Fundamentals of Communications Access Technologies.pdf | FDMA, TDMA (T1, GSM), CDMA, OFDMA, SDMA, CSMA | Read |
| 8 | Multiplexing notes.pdf (4 pp) | FDMA, SDMA, TDMA (fixed/dynamic), CDMA, cellular | Read |
| 9 | OFDM.pdf (11 pp) | Orthogonality, OFDMA subcarrier methods, scheduling, SC-FDMA | **Pages 241–244 missing** (IFFT, PAPR) |
| 10 | Spread spectrum.pdf (5 pp) | FHSS, DSSS | **Ends mid-sentence** |
| 11 | Signal encoding techniques.pdf (11 pp) | ASK, FSK, PSK, QPSK, QAM, exercises | Read |
| 12 | WLANS_v2.pptx (47 slides) | 802.11 architecture, CSMA/CA, RTS/CTS/NAV, PCF, hidden/exposed station, PHY | Read |
| 13 | Chapter 15 WLANS by Forouzan.pdf (10 pp) | Wired vs wireless LAN, CSMA/CA, NAV, exposed station | Physical-layer table missing |
| 14 | BLUETOOTH AND IEEE 802.15_V2.pdf + Bluetooth and IEEE 802.15.pptx (90 image-only slides) | Bluetooth stack, profiles, piconets, radio, baseband, links, packets, FEC/ARQ, BT 3.0/4.0, 802.15.3/.4, ZigBee | Read (slides read visually) |

### Worksheets (2 files)

| # | File | Content | Status |
|---|---|---|---|
| 15 | Error detection and correction_v2.docx | Links, plus worked CRC examples and unsolved Hamming/checksum/CRC/parity exercises | No theory text; worked CRC examples verified correct |
| 16 | Bluetooth_Exercises_Reordered_20_Questions.pdf | 20 Bluetooth review questions (no answers) | Read |

### Assessments (7 photos = 5 papers)

| Paper | Marks | Note |
|---|---|---|
| **Exam paper** (green; no title or year; pages 2–4) | 5 questions × 20 = 100 | Page 1 not photographed |
| **Test 1, version A** (T1A) | 14 questions | |
| **COM5231 Test 1, version B** (T1B) | 9 questions | |
| **Test 2 2025** (T2-2025) | 100 | |
| **COM5231 Test 2 2026** (T2-2026) | 50 | |

No memorandums were provided, so all answers are model answers, not the lecturer's marking guide.

## B. Coverage gap: routing

Routing is **30% of the exam paper's marks** and **25–32% of the Test 2 papers** (about 16% of all 450 past-paper marks, since the Test 1 papers don't cover it). The topics are Dijkstra, Bellman-Ford, link-state vs distance-vector, count-to-infinity, MANET routing categories, and routing vs forwarding vs switching. **No uploaded notes cover these.** The course outline lists Ch. 3, Ch. 4, Ch. 10 and Ch. 13 (Agrawal, Ad hoc Networks), none of which were provided.

| Paper | Routing questions | Marks |
|---|---|---|
| Exam | Q2(d), Q3(a)–(d) | 30 / 100 |
| T2-2025 | Q1–Q3 | 25 / 100 |
| T2-2026 | Q1, Q9 | 16 / 50 |

These answers will be clearly labelled **SUPPLEMENTARY** and based on standard sources (Kurose & Ross; Agrawal).

## C. Module topic outline

1. Transmission fundamentals
2. The wireless channel
3. Channel correction mechanisms and capacity
4. Signal encoding techniques
5. Multiple access (FDMA, TDMA, CDMA, SDMA, cellular generations)
6. Spread spectrum (FHSS, DSSS)
7. OFDM, OFDMA, SC-FDMA
8. Error detection and correction (parity, checksum, Hamming, CRC)
9. Wireless LANs (IEEE 802.11)
10. Bluetooth and IEEE 802.15 (incl. ZigBee)
11. Routing and ad hoc networks (supplementary)

## D. Most-repeated past-paper questions

| Question | Appears in |
|---|---|
| Bluetooth profiles as an advantage for applications | Exam, T2-2025, T2-2026, BT exercises (4) |
| Path loss vs multipath vs interference | Exam, T1A, T1B (3) |
| FHSS and DSSS principles | Exam, T1A, T1B (3) |
| CDMA and why it is difficult to jam | Exam, T1A, T1B (3) |
| Two ISPs in a café on channel 11, then channels 1 and 11 | Exam, T1A, T2-2025 (3) |
| CRC calculation | Exam, T1B, T2-2026 (3) |
| One device as controller of two piconets | Exam, T2-2025, BT exercises (3) |
| Scatternet collision probability (80 frequencies) | Exam, T2-2025, BT exercises (3) |
| Dijkstra on the same Figure 1 network (from x, t and w) | Exam, T2-2025 (2) |
| OFDMA subcarrier approaches; three propagation mechanisms; hidden node and CSMA/CA (Figure 2); 802.11 ACKs; mobile node moving away; interference troubleshooting; Hamming; checksum; MANET routing; count-to-infinity | 2 papers each |

## E. Study plan

| Part | Content |
|---|---|
| **Part 1** | Study notes: Topics 1–4 |
| **Part 2** | Study notes: Topics 5–8 |
| **Part 3** | Study notes: Topics 9–11 |
| **Part 4** | Examination pattern analysis |
| **Parts 5–6** | Full answers to every past-paper question |
| **Part 7** | Additional practice questions with model answers |
| **Part 8** | Final revision guide and checklist |

At the end, everything is also combined into one complete PDF.
