# Part 4 — Examination Pattern Analysis

This part analyses **all five past assessments** (450 marks in total). Every statement in sections 4.1–4.6 is **counted from the papers you uploaded**. Section 4.7 is clearly labelled as **prediction**. Nobody can know what will appear in your exam, but the patterns below are strong.

**Topic numbers**: T1 Transmission fundamentals · T2 Wireless channel · T3 Channel correction/capacity · T4 Signal encoding · T5 Multiple access · T6 Spread spectrum · T7 OFDM/OFDMA · T8 Error detection/correction · T9 WLAN 802.11 · T10 Bluetooth/802.15 · T11 Routing/MANET.

---

## 4.1 Question-by-question extraction

### Exam paper (green; title/year not visible; pages 2–4; 100 marks)

| Q | Question (abridged) | Marks | Topic | Type |
|---|---|---|---|---|
| 1(a) | Differences between path loss, multipath propagation, interference | 6 | T2 | Comparison |
| 1(b) | Spread spectrum principles of (i) FHSS (ii) DSSS | 4 | T6 | Explanation |
| 1(c) | Benefits of OFDMA approaches: adjacent, regularly spaced, randomly spaced subcarriers | 6 | T7 | Explanation |
| 1(d) | Describe CDMA; why difficult to jam | 4 | T5/T6 | Explanation |
| 2(a) | Hamming code for 10101111: check bits + codeword | 4 | T8 | **Calculation** |
| 2(b) | CRC: 101110, generator 1001 | 4 | T8 | **Calculation** |
| 2(c) | Internet checksum of 1001 1100 1010 0011 (4-bit) | 2 | T8 | **Calculation** |
| 2(d) | Why is ad hoc routing complicated? Three MANET routing categories + examples | 10 | T11 | Essay |
| 3(a) | Compare and contrast link-state and distance-vector | 4 | T11 | Comparison |
| 3(b) | Essential difference: Dijkstra vs Bellman-Ford | 4 | T11 | Comparison |
| 3(c)(i) | Dijkstra on Figure 1 from **t** | 4 | T11 | **Algorithm** |
| 3(c)(ii) | Dijkstra on Figure 1 from **w** | 4 | T11 | **Algorithm** |
| 3(d) | Count-to-infinity; does it occur on link-cost decrease? On connecting two unlinked nodes? | 4 | T11 | Explanation |
| 4(a) | Bluetooth master vs 802.11 base station | 4 | T10 | Comparison |
| 4(b) | Does the hidden terminal problem occur in Bluetooth? | 4 | T10 | Application |
| 4(c) | How can profiles be an advantage for applications? | 4 | T10 | Explanation |
| 4(d) | Can one device be controller of two piconets? | 4 | T10 | Application |
| 4(e) | Scatternet of 2 piconets: collision probability (80 freq.) | 4 | T10 | **Calculation** |
| 5(a) | Mobile node moving away: two BS actions | 2 | T3 | Application |
| 5(b) | Figure 2: hidden node; A and C send simultaneously | 4 | T9 | Scenario |
| 5(c) | Figure 2: CSMA/CA when A sends | 4 | T9 | Scenario |
| 5(d) | Why ACKs in 802.11 but not wired Ethernet? | 2 | T9 | Explanation |
| 5(e)(i) | Two ISPs' APs both on channel 11 | 4 | T9 | Scenario |
| 5(e)(ii) | Channels 1 and 11 | 4 | T9 | Scenario |

### Test 1, version A (T1A; 100 marks)

| Q | Question | Marks | Topic | Type |
|---|---|---|---|---|
| 1 | Three basic propagation mechanisms in a mobile system | 12 | T2 | Explanation |
| 2 | Main problems of signal propagation; why not straight lines; reflection useful and harmful | 12 | T2 | Essay |
| 3 | Path loss vs multipath vs interference | 9 | T2 | Comparison |
| 4 | FHSS and DSSS principles | 10 | T6 | Explanation |
| 5 | Benefits of the three OFDMA approaches | 9 | T7 | Explanation |
| 6 | CDMA; why difficult to jam | 4 | T5/T6 | Explanation |
| 7 | Mobile node moving away: two BS actions | 4 | T3 | Application |
| 8 | Figure 2: hidden node; A and C simultaneous | 4 | T9 | Scenario |
| 9 | Figure 2: CSMA/CA when A sends | 4 | T9 | Scenario |
| 10 | Why ACKs in 802.11 but not Ethernet | 4 | T9 | Explanation |
| 11(i) | Two ISPs on channel 11 | 4 | T9 | Scenario |
| 11(ii) | Channels 1 and 11 | 4 | T9 | Scenario |
| 12 | Receiving site: occasional loss of signal due to interference; steps to correct | 10 | T2/T9 | Scenario/essay |
| 13 | Why many WiFi networks have high error rate from co-channel interference | 4 | T9 | Explanation |
| 14 | 850 MHz, 125 mW, received 1 µW: distance? | 6 | T2 | **Calculation** |

### COM5231 Test 1, version B (T1B; 100 marks)

| Q | Question | Marks | Topic | Type |
|---|---|---|---|---|
| 1 | Single-bit vs burst errors; extent parity is appropriate | 10 | T8 | Explanation |
| 2(a) | CRC: 10011010, x³ + x² + 1 (polynomial long division) | 10 | T8 | **Calculation** |
| 2(b) | Leftmost bit inverted: receiver's CRC result; how it knows | 6 | T8 | **Calculation** |
| 3 | Three basic propagation mechanisms | 12 | T2 | Explanation |
| 4 | Path loss vs multipath vs interference | 12 | T2 | Comparison |
| 5 | Three methods to increase capacity of a wireless system | 12 | T3 | Essay |
| 6 | FHSS and DSSS principles | 10 | T6 | Explanation |
| 7 | CDMA; why difficult to jam | 10 | T5/T6 | Explanation |
| 8 | Difference between OFDM and OFDMA | 10 | T7 | Comparison |
| 9 | SU-MIMO vs MU-MIMO | 8 | T3 | Comparison |

### Test 2 2025 (T2-2025; 100 marks)

| Q | Question | Marks | Topic | Type |
|---|---|---|---|---|
| 1 | Three categories of MANET routing protocols | 12 | T11 | Explanation |
| 2 | Dijkstra on Figure 1 from **x** | 8 | T11 | **Algorithm** |
| 3 | Count-to-infinity problem | 5 | T11 | Explanation |
| 4 | Hidden terminal problem; does it occur in Bluetooth? | 10 | T9/T10 | Explanation |
| 5 | Compare wired and wireless LANs; unique WLAN design concerns | 10 | T9 | Comparison/essay |
| 6 | Receiving site with interference: steps to correct | 10 | T2/T9 | Scenario |
| 7 | Bluetooth profiles: benefit to applications | 10 | T10 | Explanation |
| 8 | Scatternet collision probability | 10 | T10 | **Calculation** |
| 9 | One device as controller of two piconets? | 5 | T10 | Application |
| 10(i) | Two ISPs on channel 11 | 10 | T9 | Scenario |
| 10(ii) | Channels 1 and 11 | 10 | T9 | Scenario |

### COM5231 Test 2 2026 (T2-2026; 50 marks)

| Q | Question | Marks | Topic | Type |
|---|---|---|---|---|
| 1 | Routing vs packet forwarding vs switching: purpose and decision information | 6 | T11 | Comparison |
| 2(a)–(c) | Hamming for 11001010 (inequality, placement, codeword) | 8 | T8 | **Calculation** |
| 3(a)–(c) | CRC: 110101, G = 1011 | 6 | T8 | **Calculation** |
| 4(a)–(b) | Checksum 1010 1100 0110 1001 + receiver result | 4 | T8 | **Calculation** |
| 5 | Define single-bit and burst error; burst length | 3 | T8 | Definition |
| 6(a)–(c) | Even parity: single-bit? burst? can it correct? | 5 | T8 | Application |
| 7 | Two ways profiles benefit developers/users | 4 | T10 | Explanation |
| 8 | Bluetooth central vs 802.11 AP: medium access, connecting to other networks | 4 | T10 | Comparison |
| 9(a)–(b) | Dijkstra from A (new figure); final costs and routes | 10 | T11 | **Algorithm** |

---

## 4.2 Marks by topic (counted)

| Topic | Exam | T1A | T1B | T2-2025 | T2-2026 | **Total** | **% of 450** |
|---|---|---|---|---|---|---|---|
| T2 Wireless channel (incl. interference troubleshooting, path-loss calc) | 6 | 49 | 24 | 10 | — | **89** | **19.8%** |
| T9 WLAN 802.11 | 18 | 24 | — | 35 | — | **77** | **17.1%** |
| T11 Routing/MANET *(no notes)* | 30 | — | — | 25 | 16 | **71** | **15.8%** |
| T8 Error detection/correction | 10 | — | 26 | — | 26 | **62** | **13.8%** |
| T10 Bluetooth/802.15 | 20 | — | — | 30 | 8 | **58** | **12.9%** |
| T3 Channel correction/capacity/MIMO | 2 | 4 | 20 | — | — | **26** | **5.8%** |
| T7 OFDM/OFDMA | 6 | 9 | 10 | — | — | **25** | **5.6%** |
| T6 Spread spectrum | 4 | 10 | 10 | — | — | **24** | **5.3%** |
| T5 Multiple access (CDMA) | 4 | 4 | 10 | — | — | **18** | **4.0%** |
| T1 Transmission fundamentals | — | — | — | — | — | **0** | 0% |
| T4 Signal encoding | — | — | — | — | — | **0** | 0% |
| **Total** | 100 | 100 | 100 | 100 | 50 | **450** | 100% |

**The exam paper itself (the best guide to your final exam)**: T11 routing **30**, T10 Bluetooth **20**, T9 WLAN **18**, T8 coding **10**, T2 **6**, T7 **6**, T6 **4**, T5 **4**, T3 **2**. The exam **samples every half of the module**: Q1 = Test 1 material (channel, SS, OFDMA, CDMA); Q2–Q3 = coding + routing; Q4 = Bluetooth; Q5 = WLAN.

---

## 4.3 Repeated and closely related questions (counted)

| # | Question (essentially identical wording) | Papers | Count |
|---|---|---|---|
| R1 | **Bluetooth profiles add complexity; how are they an advantage to applications?** | Exam 4(c), T2-2025 Q7, T2-2026 Q7, BT exercise 19 | **4** |
| R2 | **Path loss vs multipath vs interference** | Exam 1(a), T1A Q3, T1B Q4 | **3** |
| R3 | **Spread spectrum principles of FHSS and DSSS** | Exam 1(b), T1A Q4, T1B Q6 | **3** |
| R4 | **Describe CDMA; why difficult to jam** | Exam 1(d), T1A Q6, T1B Q7 | **3** |
| R5 | **Two ISPs' APs on channel 11; then channels 1 and 11** | Exam 5(e), T1A Q11, T2-2025 Q10 | **3** |
| R6 | **CRC calculation** (different numbers) | Exam 2(b), T1B Q2, T2-2026 Q3 (+ worksheet) | **3** |
| R7 | **One device as controller/master of two piconets** | Exam 4(d), T2-2025 Q9, BT exercise 9 | **3** |
| R8 | **Scatternet collision probability, 80 frequencies** | Exam 4(e), T2-2025 Q8, BT exercise 20 | **3** |
| R9 | **Bluetooth master vs 802.11 base station / AP** | Exam 4(a), T2-2026 Q8, BT exercise 8 | **3** |
| R10 | **Three basic propagation mechanisms** | T1A Q1, T1B Q3 (+ lecturer review Q) | **2** |
| R11 | **Benefits of OFDMA approaches (adjacent / regular / random)** | Exam 1(c), T1A Q5 (+ OFDM review 8.10) | **2** |
| R12 | **Hidden node with Figure 2; A and C transmit simultaneously** | Exam 5(b), T1A Q8 | **2** |
| R13 | **CSMA/CA with Figure 2, A sending** | Exam 5(c), T1A Q9 | **2** |
| R14 | **Why ACKs in 802.11 but not in Ethernet** | Exam 5(d), T1A Q10 | **2** |
| R15 | **Mobile node moving away: two actions** | Exam 5(a), T1A Q7 | **2** |
| R16 | **Interference at a receiving site: steps to correct** | T1A Q12, T2-2025 Q6 | **2** |
| R17 | **Hamming code** (different data) | Exam 2(a), T2-2026 Q2 (+ worksheet) | **2** |
| R18 | **Internet checksum, 4-bit words** | Exam 2(c), T2-2026 Q4 (+ worksheet) | **2** |
| R19 | **Single-bit vs burst errors; parity** | T1B Q1, T2-2026 Q5–6 (+ worksheet) | **2** |
| R20 | **Three categories of MANET routing** | Exam 2(d), T2-2025 Q1 | **2** |
| R21 | **Dijkstra on the same Figure 1** (from x, t, w) | Exam 3(c), T2-2025 Q2 | **2** (+ T2-2026 Q9 new graph) |
| R22 | **Count-to-infinity** | Exam 3(d), T2-2025 Q3 | **2** |
| R23 | **Hidden terminal problem in Bluetooth** | Exam 4(b), T2-2025 Q4 | **2** |

**Key finding**: these **23 question types account for the large majority of the 450 marks.** Of the 24 sub-questions in the exam paper, **22** also appear (same or nearly the same wording) in a test, the worksheet or the Bluetooth exercise sheet. The only exam-only items are Q3(a) link-state vs distance-vector and Q3(b) Dijkstra vs Bellman-Ford. The lecturer **reuses questions heavily**, often word for word, and changes only the numbers in calculations.

**Questions copied word for word from sources**:
- **Test 1A Q14** = *Wireless Communication Problems*, **Problem 2.7** (same numbers).
- **Exam 2(a)** (Hamming 10101111) and **Exam 2(c)** (checksum 1001 1100 1010 0011) = the **error-detection worksheet** exercises.
- **Exam Q4(a), (c), (d), (e)** = **Bluetooth exercises 8, 19, 9, 20**.
- **T1B Q1** = the last worksheet question; **T1B Q2** = the worksheet's CRC example with a different message.
- **Exam Q3 / T2-2025 Q2** Figure 1 = Kurose & Ross Ch. 5 network; **T2-2026 Q9** = Tanenbaum's Dijkstra figure.
- **T1B Q9, T1A Q1** = the lecturer's own review list on *The Wireless Channel* slide 72.

---

## 4.4 Common question formats

| Format | Typical wording | Typical marks | Examples |
|---|---|---|---|
| **Compare / differences** | "What are the differences…", "Compare and contrast…", "Distinguish…" | 4–12 | R2, R9, OFDM vs OFDMA, SU vs MU-MIMO, LS vs DV, wired vs wireless LAN |
| **Explain principle** | "Explain the principles of…", "Describe…" | 4–12 | FHSS/DSSS, CDMA, propagation mechanisms |
| **Scenario / figure** | "Use Figure 2 to…", "Suppose two ISPs…" | 2–10 | Hidden node, CSMA/CA, ISP café, interference site |
| **Yes/No + justify** | "Does … occur? Explain", "Is there any reason why…" | 4–10 | Hidden terminal in BT; two piconets; count-to-infinity |
| **Calculation** | "Show…", "What is the value…" | 2–16 | Hamming, CRC, checksum, path loss/distance, collision probability |
| **Algorithm trace** | "Apply Dijkstra… step-by-step" | 4–10 | Figure 1, T2-2026 figure |
| **Essay** | "Discuss the steps…", "State and explain the three…" | 10–12 | Interference troubleshooting, capacity methods, MANET categories |

---

## 4.5 Calculation and algorithm questions (counted)

| Calculation | Appears | Marks available |
|---|---|---|
| **CRC** | Exam, T1B, T2-2026 | 4 + 16 + 6 = **26** |
| **Dijkstra** | Exam (×2), T2-2025, T2-2026 | 8 + 8 + 10 = **26** |
| **Hamming** | Exam, T2-2026 | 4 + 8 = **12** |
| **Scatternet probability** | Exam, T2-2025 | 4 + 10 = **14** |
| **Internet checksum** | Exam, T2-2026 | 2 + 4 = **6** |
| **Free-space distance/power** | T1A | **6** |

**≈ 90 of 450 marks (20%) are pure calculation/algorithm.** These are the **most reliable marks**: the method never changes, only the numbers.

---

## 4.6 Depth of knowledge required
- Most 4-mark questions want **2–4 precise, explained points** (≈ one point per 1–2 marks).
- 10–12 mark questions want **structure**: a definition, then 3–5 explained points or a comparison table, then a conclusion.
- Scenario questions reward **applying** the theory (CSMA/CA steps, NAV, CTS) to the named nodes (A, B, C), not reciting it.
- Calculations reward **showing every step** (formula, substitution, each XOR or table row, the final answer with units). Several questions explicitly say *"clearly presenting your step-by-step process"*.
- **No questions** in any paper on **Topic 1 (Nyquist/Shannon)** or **Topic 4 (ASK/FSK/PSK/QAM)**. They are still in the module and the lecturer's exercises, so don't skip them, but rank them lower.

---

## 4.7 PREDICTION (not fact): priorities for the final exam

These are **predictions** based on the patterns above. They are not knowledge of the exam.

**Very high probability (appeared in the exam AND in tests; prepare word-perfect answers):**
1. Bluetooth profiles advantage (R1); master vs AP (R9); two piconets (R7); scatternet probability (R8); hidden terminal in BT (R23).
2. Two-ISP café scenario (R5); hidden node and CSMA/CA with Figure 2 (R12, R13); ACKs (R14).
3. Dijkstra (any graph; Figure 1 from any node); LS vs DV; Dijkstra vs Bellman-Ford; count-to-infinity; MANET categories.
4. Hamming, CRC and checksum with **new numbers**.
5. Path loss vs multipath vs interference; FHSS/DSSS; CDMA jamming; OFDMA approaches.

**Medium probability (appeared in tests only):** three propagation mechanisms; propagation problems; capacity methods; OFDM vs OFDMA; SU vs MU-MIMO; wired vs wireless LAN; interference troubleshooting; co-channel interference; routing/forwarding/switching; parity and burst errors; path-loss distance calculation.

**Lower probability but examinable (in notes/review questions, never yet examined):** Nyquist/Shannon calculations; modulation (ASK/FSK/PSK/QAM); FDMA/TDMA details and formulas; cellular generations; SC-FDMA; 802.15.3/.4 and ZigBee; Bluetooth packet format and links; PCF/IFS details; channel correction mechanisms (FEC, equalization, AMC).

**Recommended study time split** (prediction-based): Routing 20% · WLAN 20% · Bluetooth 20% · Error coding 15% · Wireless channel/SS/CDMA/OFDMA 20% · Everything else 5%.
