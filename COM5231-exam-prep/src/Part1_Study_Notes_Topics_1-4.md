# Part 1 — Detailed Study Notes: Topics 1–4

**Topics in this part**
1. Transmission Fundamentals
2. The Wireless Channel (propagation, path loss, noise, fading) + wireless calculations
3. Channel Correction Mechanisms and Capacity (FEC, equalisation, diversity, MIMO, AMC, bandwidth expansion)
4. Signal Encoding Techniques (ASK, FSK, PSK, QPSK, QAM, BER)

---

## How to read these notes

**Source codes used in citations**

| Code | File |
|---|---|
| **[TF-S n]** | *Chapter 2 Transmission Fundamentals.pptx*, slide n |
| **[TF-B p]** | *CHAPTER 2 Transmission Fundamentals_1.pdf* (Beard & Stallings textbook), book page p |
| **[WC-S n]** | *The Wireless Channel.pptx*, slide n |
| **[WC-B §]** | *Wireless Communication.pdf* (textbook Chapter 5), section § |
| **[WCP]** | *Wireless Communication Problems.pdf* (Basics of Wireless Networks, §2.3) |
| **[SE]** | *Signal encoding techniques.pdf* (Forouzan Ch. 5) |
| **[MA p]** | *Multiple access techniquesV2.pdf*, page p |

**Labels**
- Everything **without a label** comes from your lecture material.
- 🟦 **SUPPLEMENTARY** marks explanation or content that is *not* in your uploaded notes. Use it to understand, but in the exam prefer the lecturer's wording.
- ⚠️ **NOTES ERROR** marks a place where your notes contain a mistake. The correction is shown and verified.
- 🎯 **EXAM** marks how the topic has been or could be examined. "Asked in:" lists real past-paper questions.

**Past-paper short names**: *Exam* (green paper, pp. 2–4), *T1A* (Test 1, 14 questions), *T1B* (COM5231 Test 1, 9 questions), *T2-2025*, *T2-2026*.

---
---

# TOPIC 1 — TRANSMISSION FUNDAMENTALS

## 1.1 Introduction

Every wireless system moves information by sending an **electromagnetic signal** from a transmitter to a receiver. Before you can understand fading, OFDM, CDMA or Wi-Fi, you need the basic vocabulary: what a signal is, how it can be described in **time** and in **frequency**, what **bandwidth** is, and what limits the **maximum data rate** of a channel (Nyquist and Shannon). This topic is the foundation of the whole module. It is the first chapter of the textbook (Beard & Stallings, *Wireless Communication Networks and Systems*) that the module follows [TF-S 1].

**Learning objectives** [TF-S 3]:
- Distinguish between digital and analog information sources.
- Explain how audio, data, image and video can be represented by electromagnetic signals.
- Discuss the characteristics of analog and digital waveforms.
- Explain the roles of frequencies and frequency components in a signal.
- Identify the factors that affect channel capacity.
- Compare and contrast various forms of wireless transmission.

## 1.2 Key definitions

| Term | Definition (lecturer's wording) | Source |
|---|---|---|
| **Electromagnetic signal** | A function of time that can also be expressed as a function of frequency; the signal consists of components of different frequencies. | [TF-S 4] |
| **Analog signal** | Signal intensity varies in a smooth fashion over time; no breaks or discontinuities. | [TF-S 5] |
| **Digital signal** | Signal intensity maintains a constant level for some period of time and then changes to another constant level. | [TF-S 5] |
| **Periodic signal** | An analog or digital signal pattern that repeats over time: s(t + T) = s(t), −∞ < t < +∞, where T is the period. | [TF-S 5] |
| **Aperiodic signal** | An analog or digital signal pattern that does not repeat over time. | [TF-S 7] |
| **Peak amplitude (A)** | Maximum value or strength of the signal over time; typically measured in volts. | [TF-S 7] |
| **Frequency (f)** | Rate, in cycles per second or hertz (Hz), at which the signal repeats. | [TF-S 7] |
| **Period (T)** | Amount of time it takes for one repetition of the signal; **T = 1/f**. | [TF-S 8] |
| **Phase (φ)** | Measure of the relative position in time within a single period of a signal. | [TF-S 8] |
| **Wavelength (λ)** | Distance occupied by a single cycle of the signal, or the distance between two points of corresponding phase of two consecutive cycles; **λ = vT**, and for radio **λ = c/f**. | [TF-S 8] |
| **Fundamental frequency** | When all frequency components of a signal are integer multiples of one frequency, that frequency is the fundamental frequency. (The other components are called **harmonics** [TF-B 13].) | [TF-S 13] |
| **Spectrum** | Range of frequencies that a signal contains. | [TF-S 13] |
| **Absolute bandwidth** | Width of the spectrum of a signal. | [TF-S 13] |
| **Effective bandwidth (or just bandwidth)** | Narrow band of frequencies in which most of the signal's energy is contained. | [TF-S 13] |
| **Data** | Entities that convey meaning, or information. | [TF-S 17] |
| **Signals** | Electric or electromagnetic representations of data. | [TF-S 17] |
| **Transmission** | Communication of data by the propagation and processing of signals. | [TF-S 17] |
| **Channel capacity** | The maximum rate at which data can be transmitted over a given communication path, or channel, under given conditions. | [TF-S 26] |
| **Noise** | Unwanted signal, e.g. crosstalk, thermal noise, impulse noise from lightning; it degrades signal quality. | [TF-S 26] |
| **Signal-to-noise ratio (SNR, S/N)** | Ratio of the power in a signal to the power contained in the noise present at a particular point in the transmission; typically measured at a receiver. | [TF-S 30] |
| **Transmission medium** | Physical path between transmitter and receiver. | [TF-S 34] |
| **Multiplexing** | Carrying multiple signals on a single medium. | [TF-S 43] |

## 1.3 Time-domain concepts

### The sine wave: the basic analog signal
The general sine wave is [TF-S 10]:

```
s(t) = A sin(2πft + φ)
```

It has three parameters. Changing each one changes the wave differently (Figure 2.3 in the notes):

| Case | Parameters | Effect |
|---|---|---|
| (a) | A = 1, f = 1 Hz, φ = 0 | Reference wave; T = 1 s |
| (b) | A = 0.5 | Same shape, **half the height** (reduced peak amplitude) |
| (c) | f = 2 Hz | **Twice as many cycles** per second; T = ½ s |
| (d) | φ = π/4 rad (45°) | Wave is **shifted in time** by 1/8 of a period |

Remember: **2π radians = 360° = 1 period** [TF-S 10].

```
 A ┤   .-.         .-.          Amplitude A = peak height
   │  /   \       /   \         Period T   = time for one cycle
 0 ┼─/─────\─────/─────\────►t  f = 1/T
   │        \   /       \
-A ┤         '-'         '-
   |<-- T -->|
```

### Time vs distance [TF-S 12]
- With **time** on the horizontal axis, the graph shows the signal's value **at one point in space** as time passes.
- With **distance** on the horizontal axis, the graph shows the signal's value **at one instant in time** at different distances from the source.
- At a particular instant, the intensity of a radio wave varies sinusoidally with distance from the antenna. One cycle in space is the **wavelength λ**.

### Worked example: period, frequency, wavelength 🟦 SUPPLEMENTARY practice
*A Wi-Fi signal has f = 2.4 GHz. Find T and λ.*
- T = 1/f = 1/(2.4 × 10⁹) = **4.17 × 10⁻¹⁰ s (0.417 ns)**
- λ = c/f = (3 × 10⁸)/(2.4 × 10⁹) = **0.125 m (12.5 cm)**

## 1.4 Frequency-domain concepts

**Key idea**: any electromagnetic signal can be shown to consist of a **collection of periodic analog signals (sine waves) at different amplitudes, frequencies and phases**. The **period of the total signal equals the period of the fundamental frequency** [TF-S 15]. This is Fourier analysis [TF-B 14].

**Example from the notes** [TF-B 13–14, TF-S 14]:

```
s(t) = (4/π) × [ sin(2πft) + (1/3) sin(2π(3f)t) ]
```

- The components are at **f** and **3f**. Since 3f is an integer multiple of f, **f is the fundamental** and 3f is a harmonic.
- The spectrum extends from f to 3f, so the **absolute bandwidth = 3f − f = 2f**.
- Adding more odd harmonics (5f, 7f, …) makes the waveform look more and more like a **square wave** (Figure 2.5). A perfect square wave needs infinitely many harmonics, so it has **infinite bandwidth** [TF-B 15].

## 1.5 Relationship between data rate and bandwidth

**The greater the bandwidth, the higher the information-carrying capacity** [TF-S 16].

**Conclusions the lecturer lists** [TF-S 16]:
1. Any digital waveform (rectangular pulses) has **infinite bandwidth**.
2. **BUT** the transmission system will limit the bandwidth that can be transmitted.
3. **AND**, for any given medium, the greater the bandwidth transmitted, the **greater the cost**.
4. **HOWEVER**, limiting the bandwidth creates **distortions**.

Analogy from the slide: **bandwidth is the width of a pipe; data rate is the actual amount of digital data transmitted** [TF-S 16].

### Worked illustration: the three cases [TF-B 15–17]
A square wave of alternating 0s and 1s: each pulse lasts 1/(2f), so **data rate = 2f bps**.

| Case | Approximation used | f | Bandwidth | Data rate |
|---|---|---|---|---|
| I | f + 3f + 5f components | 1 MHz | 5f − f = 4 MHz | 2f = **2 Mbps** |
| II | f + 3f + 5f components | 2 MHz | 5f − f = 8 MHz | 2f = **4 Mbps** |
| III | f + 3f only (rougher wave) | 2 MHz | 3f − f = 4 MHz | 2f = **4 Mbps** |

**Lessons**:
- Case I → II: **doubling the bandwidth doubles the data rate**.
- Case I → III: the **same bandwidth (4 MHz) can carry different data rates**, depending on how well the receiver can tell a 0 from a 1 in the presence of noise. A rougher waveform uses less bandwidth per bit but is harder to detect.

## 1.6 Analog and digital data, signals and transmission

### Data [TF-S 18]
- **Analog data** take continuous values in some interval: video, audio (and sensor data such as temperature and pressure [TF-B 17]).
- **Digital data** take discrete values: text, integers.

### Signals [TF-S 19–20]

| | **Analog signal** | **Digital signal** |
|---|---|---|
| What it is | A continuously varying electromagnetic wave | A sequence of voltage pulses |
| Media | Copper (twisted pair, coax), fibre, atmosphere/space | Copper wire medium |
| Carries | Analog **and** digital data | Analog **and** digital data |
| Advantages | — | Generally **cheaper**; **less susceptible to noise** |
| Disadvantages | — | **Suffers more from attenuation** |

Attenuation of a digital signal: pulses become **rounded and smaller** as higher-frequency components are attenuated, which can quickly lead to loss of information [TF-S 22, TF-B 18].

### The four data/signal combinations and why each is used [TF-S 21]

| Combination | Device | Reason for choosing it |
|---|---|---|
| **Digital data → digital signal** | Encoder | Encoding equipment is **less expensive** than digital-to-analog equipment |
| **Analog data → digital signal** | **Codec** (coder–decoder) | Permits use of **modern digital transmission and switching equipment** |
| **Digital data → analog signal** | **Modem** (modulator–demodulator) | **Some media only propagate analog signals**, e.g. optical fibre and satellite |
| **Analog data → analog signal** | (e.g. telephone handset) | Analog data are **easily converted** to an analog signal |

Voice example: sound covers 20 Hz–20 kHz, speech energy is mostly 100 Hz–7 kHz, and the standard telephone channel is **300–3400 Hz** [TF-B 20].

### Analog vs digital transmission [TF-S 24–25]

| | **Analog transmission** | **Digital transmission** |
|---|---|---|
| Concern | Transmits analog signals **without regard to content** | **Concerned with the content** of the signal |
| Distance limit | Attenuation limits link length | Attenuation endangers data integrity |
| Long-distance device | **Amplifiers** (cascaded) | **Repeaters** |
| What the device does | Boosts energy, **but also boosts noise and causes distortion** | **Recovers** the 1s and 0s and **retransmits a new, clean signal**, so noise is not accumulated |
| Effect on data | Analog data tolerate distortion; **digital data get errors** | Works for digital signals, and for analog signals carrying digital data (the retransmission device recovers the data and generates a new clean analog signal) |

## 1.7 Channel capacity

### Four related concepts [TF-S 28]
1. **Data rate**: rate at which data can be communicated (bps).
2. **Bandwidth**: bandwidth of the transmitted signal, as constrained by the transmitter and the medium (Hz).
3. **Noise**: average level of noise over the path.
4. **Error rate**: rate at which errors occur (transmit 1, receive 0, or vice versa).

The goal: get **as high a data rate as possible at a given error rate for a given bandwidth**. The main constraint is **noise** [TF-B 22].

### 1.7.1 Nyquist bandwidth (noiseless channel) [TF-S 29, TF-B 22–23]

For a **noiseless** channel, the Nyquist formula gives the **theoretical maximum bit rate**.

- **Binary signals (2 levels):** **C = 2B**
- **Multilevel signalling:** **C = 2B log₂ M**

where B = channel bandwidth (Hz), M = number of signal levels, C = bit rate (bps).

**Why it holds**: given bandwidth B, the highest **signal (symbol) rate** is 2B, a limit caused by intersymbol interference. Each symbol carries log₂M bits [TF-B 22].

**Trade-off**: increasing M increases the data rate for the same bandwidth, **but** the receiver must now distinguish one of M signals instead of two. **Noise limits the practical value of M** [TF-B 23].

#### Worked example N1 (lecturer's Example 1) [TF-S 29]
*Noiseless channel, B = 4000 Hz, two signal levels. Maximum bit rate?*
1. Formula: C = 2B log₂M
2. Substitute: C = 2 × 4000 × log₂2 = 2 × 4000 × 1
3. **C = 8000 bps** ✔ (matches the slide's answer)

#### Worked example N2 (lecturer's Example 2) [TF-S 29]
*Send 250 kbps over a noiseless channel with B = 30 kHz. How many signal levels?*
1. 250 000 = 2 × 30 000 × log₂M
2. log₂M = 250 000 / 60 000 = 4.167
3. M = 2^4.167 = 17.96
4. **M ≈ 18 levels** ✔ (the slide's answer)

🟦 SUPPLEMENTARY: practical systems use a **power of 2** for M (each level must map to a whole number of bits). With 16 levels you get only 240 kbps, which is too little, so a real design would use **M = 32**. If the question says "how many levels are needed", give 18 as the lecturer does, and add one line noting that 32 would be used in practice.

#### Worked example N3 (end-of-chapter exercise) [TF-S 50]
*Maximum data rate of a channel with B = 200 kHz and four levels of digital signalling?*
- C = 2 × 200 000 × log₂4 = 2 × 200 000 × 2 = **800 kbps**

#### Worked example N4 (textbook) [TF-B 23]
*Voice channel, B = 3100 Hz.* Binary: C = 2B = **6200 bps**. With M = 8: C = 2 × 3100 × 3 = **18 600 bps**.

### 1.7.2 Signal-to-noise ratio (SNR) [TF-S 30, TF-B 23]

```
SNR_dB = 10 log₁₀ ( signal power / noise power )
```

- A **high SNR** means a **high-quality signal** and **fewer intermediate repeaters** are needed.
- **SNR sets the upper bound on the achievable data rate.**

Converting dB back to a ratio: **SNR = 10^(SNR_dB / 10)**.

### 1.7.3 Shannon capacity (noisy channel) [TF-S 31, TF-B 24]

Real channels are always noisy. Shannon's formula gives the **theoretical highest data rate for a noisy channel**:

```
C = B log₂(1 + SNR)        (SNR as a ratio, NOT in dB)
```

**Limitations** [TF-S 31]:
- It is a **theoretical maximum**; in practice only much lower rates are achieved.
- It assumes **white (thermal) noise** only.
- **Impulse noise** is not accounted for.
- **Attenuation distortion and delay distortion** are not accounted for.

**Further observations** [TF-B 25]:
- C is the **error-free capacity**: if the actual information rate is below C, it is theoretically possible to find a code that gives error-free transmission. Shannon does not say how to find such codes, but the formula is a yardstick for practical schemes.
- One might think the rate can be increased just by raising **signal strength** or **bandwidth**. But stronger signals increase **nonlinearities and intermodulation noise**, and because noise is white, a **wider bandwidth admits more noise**, so **as B increases, SNR decreases**.

#### Worked example S1: Nyquist and Shannon together (lecturer's slides 32–33; textbook Example 2.1)
*The spectrum of a channel is between 3 MHz and 4 MHz; SNR_dB = 24 dB. (a) Find the Shannon capacity. (b) How many signalling levels are needed to reach it?*

**Step 1: bandwidth.** B = 4 MHz − 3 MHz = **1 MHz**

**Step 2: convert SNR from dB to a ratio.**
24 = 10 log₁₀(SNR) → SNR = 10^2.4 = **251** (more precisely 251.19)

**Step 3: Shannon.**
C = 10⁶ × log₂(1 + 251) = 10⁶ × log₂(252) ≈ 10⁶ × 7.98 ≈ **8 Mbps**

**Step 4: Nyquist, to find M.**
8 × 10⁶ = 2 × 10⁶ × log₂M → log₂M = 4 → **M = 16 levels**

**Interpretation**: 8 Mbps is a theoretical limit that is unlikely to be reached. If it were reached, you would need 16-level signalling.

> 🎯 **EXAM TIP**: The commonest mistake is putting the dB value straight into Shannon's formula. **Always convert dB → ratio first.**

## 1.8 Transmission media and the spectrum

### Guided vs unguided media [TF-S 34–35]
- **Guided media**: waves are guided along a solid medium (copper twisted pair, coaxial cable, optical fibre).
- **Unguided media**: provide a means of transmission but do not guide the signal. Usually called **wireless transmission** (atmosphere, outer space). Transmission and reception are **by means of an antenna**.
  - **Directional**: focused beam.
  - **Omnidirectional**: radiates in all directions.

### General frequency ranges [TF-S 38]

| Range | Frequencies | Characteristics / uses |
|---|---|---|
| **Microwave** | 1 GHz – 100 GHz | Directional beams possible; point-to-point; satellite communications |
| **Radio** | 30 MHz – 1 GHz | Suitable for **omnidirectional** applications |
| **Infrared** | ≈ 3 × 10¹¹ – 2 × 10¹⁴ Hz | Local point-to-point and multipoint applications within confined areas |

### Common wireless technologies and bands [TF-S 39]

| Technology | Frequency range | Typical applications | Characteristics |
|---|---|---|---|
| AM radio | 530–1700 kHz (MF) | Broadcast radio | Very long range; lower audio quality |
| FM radio | 88–108 MHz (VHF) | Music, local broadcasting | High-quality audio; shorter range |
| Wi-Fi | 2.4, 5 and 6 GHz | Home/office Internet | High data rates; moderate range |
| Bluetooth | 2.4 GHz | Headsets, keyboards, IoT | Short range; low power |
| 4G/LTE | 700 MHz – 2.6 GHz | Mobile broadband | Good coverage and speed |
| 5G | Sub-6 GHz and 24–100 GHz | Ultra-fast mobile, IoT | Very high speed; low latency |
| Microwave | 1–30 GHz | Satellite links, radar, point-to-point, backhaul | Line-of-sight; high capacity |
| Infrared | 300 GHz – 400 THz | TV remotes, short-range sensors, thermal imaging | Very short range; cannot penetrate walls |

### Wireless transmission types [TF-S 40–42]

| | **Terrestrial microwave** | **Satellite microwave** | **Broadcast radio** |
|---|---|---|---|
| Antenna | Parabolic dish (~3 m), rigidly fixed, narrow beam, mounted high | Satellite acts as a **microwave relay station** | **Omnidirectional**; no dish; no precise alignment needed |
| How it works | **Line-of-sight** to the receiving antenna | Receives on one band (**uplink**), amplifies/repeats, transmits on another band (**downlink**) | 30 MHz – 1 GHz (VHF and part of UHF) |
| Applications | Long-haul telecoms; short point-to-point links between buildings | TV distribution; long-distance telephone; private business networks | FM radio; UHF and VHF television |

## 1.9 Multiplexing (introduction)

**Multiplexing** means carrying multiple signals on a single medium. It is used because the capacity of a medium usually **exceeds** what a single signal needs, so multiplexing makes **more efficient use of the medium** [TF-S 43]. A **MUX** combines n inputs onto one link with n channels, and a **DEMUX** separates them again [TF-B 31].

**Reasons for its widespread use** [TF-S 45]:
1. The **cost per kbps** of a transmission facility declines as the data rate increases.
2. The **cost of transmission and receiving equipment** (per kbps) declines with increased data rate.
3. Most individual devices need only **modest data rates**.

**Two main techniques** [TF-S 46, TF-B 32]:

| | **FDM** (frequency division) | **TDM** (time division) |
|---|---|---|
| Exploits | Useful **bandwidth** of the medium exceeds the bandwidth a single signal needs | Achievable **bit rate** of the medium exceeds the data rate a single digital signal needs |
| How | Each signal is modulated onto a **different carrier frequency**; carriers are far enough apart that the bands don't overlap; **guard bands** (unused spectrum) separate channels | Portions of each signal are **interleaved in time** (bit level or blocks); one cycle of slots is a **frame** |
| Example | Voice: 300–3400 Hz fits in a 4 kHz channel; standard = **twelve 4-kHz voice channels from 60 to 108 kHz** | Six 9.6 kbps sources fit on one **57.6 kbps** line |

- **Synchronous TDM**: time slots are **preassigned and fixed** [TF-B 32].
- **Asynchronous (statistical) TDM**: time on the medium is allocated **dynamically** [TF-B 32].

#### Worked example M1 (end-of-chapter exercise) [TF-S 50]
*A voice channel occupies 4 kHz. Multiplex 10 voice channels using FDM with guard bands of 500 Hz. Required bandwidth?*
1. Ten channels need 10 × 4 kHz = 40 kHz.
2. Guard bands are needed **between** adjacent channels: 10 − 1 = **9 guard bands** → 9 × 0.5 kHz = 4.5 kHz.
3. Total = 40 + 4.5 = **44.5 kHz**.

🟦 SUPPLEMENTARY: the common mistake is counting 10 guard bands (45 kHz). Only the gaps *between* channels need guarding. If the question explicitly says guard bands at both edges as well, add those too. Compare the FDMA formula N = (Bt − 2Bg)/Bc in [MA p3], which includes edge guard bands; it will be covered in Part 2.

## 1.10 Examination focus — Topic 1

**Lecturer's review questions** [TF-S 50]. These are very likely exam material:
1. Relationship between period and frequency → **T = 1/f**.
2. What do amplitude, frequency and phase measure? → strength (peak value); repetition rate (cycles/s); relative position in time within a period.
3. How can a composite signal be decomposed into its frequencies? → **Fourier analysis**: any signal is a sum of sine waves of different amplitudes, frequencies and phases [TF-S 15].
4. Name three transmission impairments → **attenuation, distortion, noise** (Topic 2 gives the wireless list).
5. Baseband vs broadband transmission 🟦 SUPPLEMENTARY: *baseband* sends the digital signal directly, without a carrier, and needs a **low-pass** channel. *Broadband* modulates the signal onto a carrier and needs a **bandpass** channel.
6. Low-pass vs bandpass channel 🟦 SUPPLEMENTARY: a low-pass channel passes frequencies from 0 to B. A bandpass channel passes frequencies between f₁ and f₂ (f₁ > 0).
7. What does Nyquist have to do with communications? → max bit rate of a **noiseless** channel: C = 2B log₂M.
8. What does Shannon capacity have to do with communications? → max (error-free) bit rate of a **noisy** channel: C = B log₂(1 + SNR).
9. Synchronous vs statistical TDM → fixed preassigned slots vs dynamically allocated slots (statistical TDM wastes no slots on idle sources).
10. 200 kHz, 4 levels → **800 kbps** (N3).
11. 10 voice channels, 500 Hz guard bands → **44.5 kHz** (M1).

**Possible question types**
- *Definition (2 marks)*: define bandwidth / channel capacity / SNR.
- *Comparison (4–6 marks)*: analog vs digital signals; amplifiers vs repeaters; Nyquist vs Shannon; FDM vs TDM.
- *Calculation (4–6 marks)*: Nyquist levels/bit rate; dB conversion; Shannon + Nyquist combined (Example S1 pattern); FDM bandwidth.

## 1.11 Topic 1 revision summary
- A signal can be described in **time** (A, f, T, φ, λ) and in **frequency** (spectrum, bandwidth). **T = 1/f, λ = c/f.**
- Any signal is a **sum of sine waves** (Fourier). Square waves have **infinite bandwidth**; real systems limit bandwidth, which causes **distortion**.
- **More bandwidth → higher data rate**, but higher cost.
- Digital signals: cheaper and less noise-sensitive, but **attenuate more**. **Repeaters regenerate**; **amplifiers amplify noise too**.
- **Nyquist (noiseless): C = 2B log₂M.** **Shannon (noisy): C = B log₂(1 + SNR)**, with SNR as a ratio. **SNR_dB = 10 log₁₀(S/N).**
- Media: guided vs unguided. Microwave 1–100 GHz (directional), radio 30 MHz–1 GHz (omnidirectional), infrared.
- Multiplexing: **FDM** (frequency + guard bands) and **TDM** (time slots, frames; synchronous vs statistical).

---
---

# TOPIC 2 — THE WIRELESS CHANNEL

## 2.1 Introduction

The **wireless channel** is the path through the air between transmitter and receiver. Unlike a cable, it is **shared, unpredictable and constantly changing**. Signals weaken with distance, bounce off buildings, arrive by many paths, interfere with each other and fade as users move. This topic explains *what goes wrong* with a wireless signal. Topic 3 explains *how systems fix it*.

**Why it matters for the exam**: this is the **most heavily examined theory topic** in your Test 1 papers and the exam. "Three propagation mechanisms", "path loss vs multipath vs interference", "problems of signal propagation" and the distance/power calculations all come from here.

**Learning objectives** [WC-S 2]: explain the importance of unlicensed frequencies; compute path loss for free space and real-world environments using the path loss exponent; describe the effects of multipath propagation and fading; describe the approaches used to correct channel impairments; describe three bandwidth approaches.

## 2.2 Key definitions

| Term | Definition | Source |
|---|---|---|
| **Spectrum** | A compact representation of the frequency content of a signal composed of sinusoids. | [WC-S 3] |
| **ISM bands** | Industrial, Scientific and Medical bands that can be used **without a licence**, as long as transmitters stay within power limits and use a spread-spectrum technique. | [WC-S 9] |
| **Antenna** | An electrical conductor or system of conductors that **radiates** electromagnetic energy into space (transmission) or **collects** it from space (reception). | [WC-S 25] |
| **Radiation pattern** | Graphical representation of the radiation properties of an antenna as a function of space coordinates, usually shown as a 2-D cross-section. | [WC-S 27] |
| **Isotropic antenna** | Idealised point antenna that radiates power **equally in all directions** (spherical pattern). | [WC-B 5.2] |
| **Attenuation** | Strength of a signal falls off with distance over the transmission medium. | [WC-S 29] |
| **Free space loss** | Attenuation caused because the signal spreads over a larger and larger area (sphere) as distance increases, even with no obstructions. | [WC-B 5.2] |
| **Path loss exponent (n)** | Parameter that describes **how fast a radio signal's power decreases with distance** in a particular environment. | [WC-S 33] |
| **Noise** | Unwanted signals inserted somewhere between transmission and reception. | [WC-S 36] |
| **Multipath** | Obstacles reflect signals, so **multiple copies with varying delays** are received. | [WC-S 39] |
| **Intersymbol interference (ISI)** | One or more **delayed copies of a pulse** arrive at the same time as the primary pulse for a **subsequent bit**. | [WC-S 40] |
| **Fading** | The fluctuation or variation in received signal strength due to **multipath propagation, shadowing, and movement** of the transmitter, receiver or surrounding objects. (Textbook: time variation of received power caused by changes in the medium or path.) | [WC-S 42], [WC-B 5.3] |
| **Coherence time (Tc)** | Time over which the channel stays relatively constant. | [WC-B 5.3] |
| **Coherence bandwidth (Bc)** | Range of frequencies over which the channel response is relatively constant. | [WC-B 5.3] |

## 2.3 Spectrum considerations

### What differentiates one signal from another? [WC-S 4–6]
1. **Carrier frequency**: each signal is shifted from its base frequency up to a carrier. *Example*: a 22 MHz IEEE 802.11 signal centred on **2.412 GHz** occupies **2.401–2.423 GHz**.
2. **Signal power**: signals are limited in range by the allowed transmit power, so users far enough apart can **reuse the same spectrum**.
3. **Multiple access scheme**: users in the same spectrum share it by time slots (**TDMA**), frequency bands (**FDMA**) or different signal encodings (**CDMA**).

### Regulation [WC-S 7–8]
- In the USA the **FCC** regulates spectrum (military, broadcasting, public safety, mobile, amateur, …). Bands can be government-exclusive, non-government-exclusive, or shared.
- In **South Africa**, most of the work is done by **ICASA** (Independent Communications Authority of South Africa).
- **Problem**: licensing leaves spectrum **underutilised**. **Solutions**:
  - **Dynamic Spectrum Access (DSA)**: users share spectrum. **Secondary users** may use it while **primary users** are inactive, and must release it as soon as a primary user needs it [WC-B 5.1].
  - **Cognitive radio**: devices **sense** when the spectrum is busy.

### ISM bands [WC-S 9–11]
- Usable **without a licence** if transmitters stay within **power limits** and use **spread spectrum**.
- Used for **WLANs, WPANs and the Internet of Things**.
- Examples: **915 ± 13 MHz, 2450 ± 50 MHz, 5.8 ± 0.75 GHz, 57–64 GHz**.
- **The ISM issue**: powerful emissions from ISM devices (e.g. microwave ovens) can cause electromagnetic interference. Equipment in these bands **must tolerate any interference** from ISM applications, and users have **no regulatory protection**.

> 🎯 This is why 2.4 GHz Wi-Fi and Bluetooth suffer interference from microwave ovens. That idea comes back in T1A Q12, T1A Q13 and T2-2025 Q6.

## 2.4 Propagation modes [WC-S 12–17, WC-B 5.1]

A signal radiated from an antenna travels by one of three routes:

```
(a) GROUND WAVE (< ~2–3 MHz)      (b) SKY WAVE (3–30 MHz)          (c) LINE OF SIGHT (> 30 MHz)
                                         ionosphere
   Tx ~~~~~~~~~~~~~~~~~ Rx            ___________/\___________           Tx ----------------> Rx
  (follows Earth's curve)            Tx  /  hops  \ Rx               (antennas must "see" each other)
   ===================               ======================           =========================
```

| Mode | Frequencies | How it works | Examples | Notes |
|---|---|---|---|---|
| **Ground wave** | Up to ~3 MHz | Follows the **contour of the Earth**; can travel well beyond the visual horizon | **AM radio** | Suffers from atmospheric noise; affected by reflection, refraction and scattering by ground objects |
| **Sky wave** | 3–30 MHz | Signal is **refracted by the ionosphere** back to Earth; can make several hops between ionosphere and ground | Amateur radio, CB radio, international broadcasting (BBC World Service, Voice of America) | Can be received **thousands of km** away |
| **Line of sight (LOS)** | Above 30 MHz | Needed when neither ground nor sky wave works; antennas must be in line of sight | **Satellite** (above 30 MHz the ionosphere does not reflect); most technologies in this module (100s of MHz to a few GHz) | LOS does not always mean completely free space; the ability to pass through objects **degrades as frequency increases** |

**Refraction** [WC-S 19]: the bending of microwaves by the atmosphere. The speed of an EM wave depends on the **density of the medium**; when the wave changes medium its speed changes, and it **bends at the boundary**.

## 2.5 Line-of-sight transmission impairments [WC-S 18, WC-B 5.2]

The received signal differs from the transmitted signal because of transmission impairments. For analog signals these cause **random modifications** that degrade quality; for digital data they cause **bit errors**. The most significant LOS impairments:

1. **Attenuation and attenuation distortion**
2. **Free space loss**
3. **Noise**
4. **Atmospheric absorption**: water vapour and oxygen contribute to attenuation [WC-S 39]
5. **Multipath**: obstacles reflect signals so that multiple copies with varying delays are received [WC-S 39]
6. **Refraction**: bending of radio waves as they propagate through the atmosphere [WC-S 39]

### Attenuation [WC-S 29]
- The received signal must have **sufficient strength** for the receiver circuitry to interpret it.
- It must stay **sufficiently higher than noise** to be received without error.
- **Attenuation is greater at higher frequencies**, which causes **distortion**.

## 2.6 The five basic propagation mechanisms [WC-S 20–24, WC-B 5.2]

| # | Mechanism | What happens | Trigger |
|---|---|---|---|
| 1 | **Free-space propagation** | Wave travels with **no obstructions**; signal strength **decays as a function of distance** | Nothing in the way |
| 2 | **Transmission** | Signal **penetrates into and through a medium**; it is **refracted** at the surface to a different angle | Wall, window, any penetrable medium |
| 3 | **Reflection** | Wave bounces off a surface | Surface **large compared to the wavelength** (walls, buildings, ground) |
| 4 | **Diffraction** | **Secondary waves** form behind sharp edges and deliver the signal to a possibly **shadowed** receiver | Object with **sharp edges** (building corner, rooftop) |
| 5 | **Scattering** | Signal splits into many weaker outgoing signals | **Many objects small relative to the wavelength**: rough surfaces, foliage, street signs, lamp posts |

The last four involve interacting objects; the objects' **dielectric and conducting properties** affect the strength and angle of the signal [WC-B 5.2].

### The THREE basic propagation mechanisms in a mobile system ⭐ [WC-B 5.3, Figure 5.5]

🎯 **Asked in: T1A Q1 (12), T1B Q3 (12); also the lecturer's review question [WC-S 72].** The answer is **reflection, diffraction and scattering**, the three that cause multipath in a mobile (cellular) environment.

```
                Building (large)
   BS antenna  ┌──────┐
     |\        │      │◄─R── reflected wave bounces off large surface
     | \       │      │
     |  \      └──────┘◄─D── diffraction at the sharp roof edge bends signal
     |   \                     into the "shadow" behind the building
     |    \     Lamp post
     |     \      |  ◄──S── scattering: small object splits signal
     |      \     |          into many weak rays
     |       ▼ Mobile
```
*(Text version of Figure 5.5: R = reflection, D = diffraction, S = scattering.)*

1. **Reflection**: occurs when an EM signal meets a surface that is **large relative to its wavelength**. E.g. a **ground-reflected wave** near the mobile may **cancel** the LOS wave and cause high signal loss. Because the mobile antenna is lower than most buildings, **multipath interference** occurs, and reflected waves may combine **constructively or destructively** at the receiver.
2. **Diffraction**: occurs at the **edge of an impenetrable body that is large compared to the wavelength**. The edge acts as a **new source**, so waves spread in different directions and the signal can be received **even with no unobstructed LOS**.
3. **Scattering**: occurs when the obstacle is **on the order of the wavelength or smaller**. The incoming signal is **scattered into several weaker outgoing signals**. At cellular microwave frequencies there are many such objects (lamp posts, traffic signs), so **scattering effects are difficult to predict**.

**How they affect performance** [WC-B 5.3]:
- With a **clear LOS**, diffraction and scattering are generally **minor**, although **reflection may have a significant impact**.
- With **no clear LOS** (e.g. urban street level), **diffraction and scattering are the primary means of signal reception**.

## 2.7 Antennas and radiation patterns [WC-S 25–28, WC-B 5.2]

- In two-way communication, **the same antenna can be used for transmission and reception** [WC-S 25].
- An antenna radiates in all directions but **does not perform equally well in all directions**. This is described by its **radiation pattern**.

| Term | Meaning [WC-S 27] |
|---|---|
| **Beam width (half-power beam width)** | Measure of the **directivity** of the antenna |
| **Reception pattern** | The receiving antenna's equivalent of the radiation pattern |
| **Main lobe** | Direction of strongest radiation |
| **Sidelobes** | Extra energy in directions **outside the main lobe** |
| **Nulls** | Very low energy, between the main lobe and sidelobes |

- **Omnidirectional (isotropic)** pattern: a circle in 2-D; vectors A and B in any directions are **equal length**, so equal power.
- **Directional** pattern (e.g. a 4-antenna linear array spaced λ/2, main lobe ~60° wide): the vector toward the main lobe is longer, so **more power** goes in that direction.
- The pattern shows **relative antenna gain** in each direction, **not** relative coverage distance (although they are related).

## 2.8 Free space loss ⭐

### The formula [WC-S 30–31, WC-B 5.2 Eq. 5.1–5.2]
For an ideal isotropic antenna:

```
Pt/Pr = (4πd)² / λ² = (4πfd)² / c²
```

| Symbol | Meaning |
|---|---|
| Pt | Signal power at the transmitting antenna |
| Pr | Signal power at the receiving antenna |
| λ | Carrier wavelength (**λ = c/f**) |
| f | Carrier frequency |
| d | Propagation distance between antennas (**same units as λ**, e.g. metres) |
| c | Speed of light = 3 × 10⁸ m/s |

**In decibels**:
```
L_dB = 10 log(Pt/Pr) = 20 log(4πd/λ) = −20 log(λ) + 20 log(d) + 21.98 dB
     = 20 log(4πfd/c) = 20 log(f) + 20 log(d) − 147.56 dB
```

**Why it happens** (physical explanation, [WC-B 5.2]): energy radiates outward as a **growing sphere**. A receiving antenna of fixed area captures energy from only part of the sphere's surface. As d increases the sphere's area grows with **d²**, so there is less energy per unit area. **Doubling distance → ¼ of the power (−6 dB). Doubling frequency → also −6 dB.** For satellite communication this is the **primary** source of loss.

### The same formula in the "Problems" notes [WCP Eq. 2.1–2.3]
The *Wireless Communication Problems* notes write the same law in three forms. **These are the forms used in the calculation questions**:

| Equation | Use it to find |
|---|---|
| **(2.1) Pr = Pt / (4πd/λ)²** | Received ("captured") power, or rearranged for Pt, d, λ or f |
| **(2.2) SNR = Pr / Pn** | Signal-to-noise ratio (Pn = average noise power at the receiver) |
| **(2.3) Lp = (4πd/λ)² = Pt/Pr** | Path loss (a ratio, no units) |

**Rearrangements to memorise**:
```
Pt = Pr × (4πd/λ)²
d  = (λ / 4π) × √(Pt/Pr)
λ  = 4πd / √(Pt/Pr)        then  f = c/λ
f  = c × √Lp / (4πd)
```

### Path loss exponent in practical systems [WC-S 33–34]
Real environments have reflection, scattering and so on, so power falls off faster or slower than d². Generalising, **Pr ∝ 1/dⁿ**, where **n is the path loss exponent** (based on many measurement studies):

| Environment | Path loss exponent n |
|---|---|
| Free space | **2** |
| Urban area cellular radio | 2.7 – 3.5 |
| Shadowed cellular radio | 3 – 5 |
| In-building line-of-sight | 1.6 – 1.8 (less than 2: corridors act like waveguides) |
| Obstructed in building | 4 – 6 |
| Obstructed in factories | 2 – 3 |

🟦 SUPPLEMENTARY (formula not shown in your text): in dB, **L_dB(d) = L_dB(d₀) + 10 n log₁₀(d/d₀)**. Each **tenfold** increase in distance adds **10n dB** of loss: 20 dB in free space, ~35 dB in a city.

### Empirical models [WC-S 35]
Systems must be designed from **empirical data** for a specific environment (to set power levels, tower heights and mobile antenna heights). **Okumura** developed a model from detailed measurements in Tokyo, later **refined by Hata**. It has among the best accuracy across many situations and predicts path loss for **urban (small/medium city, large city), suburban and rural** environments.

## 2.9 ⭐ Wireless communication calculations: full worked set

All of these use **Pr = Pt/(4πd/λ)²**, **λ = c/f**, **c = 3 × 10⁸ m/s**, **SNR = Pr/Pn** and **Lp = (4πd/λ)²** [WCP]. Every answer below has been **recomputed and verified**.

**Method for every problem**:
1. List the givens and **convert units** (mW → ×10⁻³ W; µW → ×10⁻⁶ W; MHz → ×10⁶ Hz; km → ×10³ m).
2. Compute **λ = c/f**.
3. Pick the right rearrangement and substitute.
4. Compute, giving units, and sanity-check (received power should be tiny; distance should be plausible).

### ⭐ Problem 2.7 = **T1A Question 14 (6 marks)**
*A transmitter operates at 850 MHz with a power of 125 mW. The receiver has a received power of 1 µW. What is the distance between transmitter and receiver?*

**Given**: Pt = 125 mW = 125 × 10⁻³ W; Pr = 1 µW = 1 × 10⁻⁶ W; f = 850 × 10⁶ Hz.

**Step 1: path loss (ratio).**
Lp = Pt/Pr = (125 × 10⁻³)/(1 × 10⁻⁶) = **125 × 10³ = 125 000**

**Step 2: wavelength.**
λ = c/f = (3 × 10⁸)/(850 × 10⁶) = **0.3529 m**

**Step 3: set Lp = (4πd/λ)².**
125 000 = (4πd / 0.3529)²

**Step 4: square root of both sides.**
√125 000 = 353.55 = 4πd / 0.3529

**Step 5: solve for d.**
d = (353.55 × 0.3529) / (4π) = 124.77 / 12.566 = **9.93 m**

**Answer: d ≈ 9.93 m.**

> ⚠️ **NOTES ERROR**: the worked solution in *Wireless Communication Problems* p. 62 writes the step as "125 × 10⁻³ = (4 × 3.14 × d / 0.3529)²". The left side must be the **path loss 125 × 10³**, not 125 × 10⁻³ (which is Pt in watts). Their final answer, 9.93 m, is correct because they actually used 125 × 10³. **In the exam, write 125 × 10³**, otherwise you will get d ≈ 0.01 m and lose the marks.

### Problem 2.1: find Pt [WCP]
*f = 90 MHz, d = 650 m, Pr = 1 × 10⁻⁶ W. Find Pt.*
- λ = 3 × 10⁸ / 90 × 10⁶ = **3.33 m**
- (4πd/λ) = 4π × 650 / 3.33 = 2452.9 → squared = 6.017 × 10⁶
- Pt = Pr × (4πd/λ)² = 1 × 10⁻⁶ × 6.017 × 10⁶ = **≈ 6 W** ✔

### Problem 2.2: find d [WCP]
*Pt = 10 mW, f = 85 MHz, Pr = 0.1 µW. Find d.*
- λ = 3 × 10⁸ / 85 × 10⁶ = **3.53 m**
- Pt/Pr = 10 × 10⁻³ / 0.1 × 10⁻⁶ = 10⁵ → √ = 316.2
- d = (λ/4π) × 316.2 = (3.53/12.566) × 316.2 = **≈ 88.8 m** ✔ (notes: ≈ 88 m)

### Problem 2.3: find Pr [WCP]
*Pt = 20 mW, f = 75 MHz, d = 500 m. Find Pr.*
- λ = 3 × 10⁸ / 75 × 10⁶ = **4 m**
- (4πd/λ) = 4π × 500 / 4 = 1570.8 → squared = **2.467 × 10⁶**
- Pr = 20 × 10⁻³ / 2.467 × 10⁶ = **8.1 × 10⁻⁹ W ≈ 0.0081 µW**

> ⚠️ **NOTES ERROR (rounding)**: the notes give **0.01 µW**. The correct value is **0.0081 µW (8.1 nW)**. Write 8.1 × 10⁻⁹ W.

### Problem 2.4: SNR in dB [WCP]
*Pn = 25 µW, Pr = 100 mW. Find SNR in dB.*
- SNR = Pr/Pn = 100 × 10⁻³ / 25 × 10⁻⁶ = **4000**
- SNR_dB = 10 log₁₀(4000) = **36.0 dB** ✔

### Problem 2.5: path loss [WCP]
*d = 5 km, f = 750 MHz. Find path loss.*
- λ = 3 × 10⁸ / 750 × 10⁶ = **0.4 m**
- 4πd/λ = 4π × 5000 / 0.4 = **157 080**
- Lp = (157 080)² = **2.47 × 10¹⁰** (in dB: 10 log(2.47 × 10¹⁰) ≈ **103.9 dB**)

> ⚠️ **NOTES ERROR**: the notes give **Lp = 2.46 × 10⁸**, which is wrong by a factor of 100. 157 080² = 2.467 × 10¹⁰. Check: 1.57 × 10⁵ squared = 2.47 × 10¹⁰.

### Problem 2.6: find frequency [WCP]
*Lp = 10⁹, d = 3 km. Find f.*
- Lp = (4πdf/c)² → √Lp = 4πdf/c
- √10⁹ = 31 623 = 4π × 3000 × f / 3 × 10⁸
- f = 31 623 × 3 × 10⁸ / (4π × 3000) = **251.6 MHz** ✔

### End-of-section unsolved problems (WCP p. 72), solved and verified

| # | Given | Find | Working | **Answer** |
|---|---|---|---|---|
| 1 | f = 600 MHz, Pt = 100 mW, Pr = 0.1 µW | d | λ = 0.5 m; Pt/Pr = 10⁶, √ = 1000; d = 0.5 × 1000 / 4π | **39.8 m** |
| 2 | d = 2.5 km, f = 450 MHz, Pt = 75 mW | Pr | λ = 0.667 m; 4πd/λ = 47 124; ² = 2.22 × 10⁹; Pr = 0.075/2.22 × 10⁹ | **3.38 × 10⁻¹¹ W (33.8 pW)** |
| 3 | Pt = 175 mW, d = 2 km, Pr = 0.25 µW | f | √(Pt/Pr) = √(7 × 10⁵) = 836.7; f = 836.7 × 3 × 10⁸ / (4π × 2000) | **≈ 9.99 MHz** |
| 4 | f = 550 MHz, d = 1.5 km, Pr = 0.01 µW | Pt | λ = 0.5455 m; 4πd/λ = 34 558; ² = 1.194 × 10⁹; Pt = 10⁻⁸ × 1.194 × 10⁹ | **≈ 11.9 W** |
| 5 | f = 550 MHz, d = 3 km | Lp | λ = 0.5455 m; 4πd/λ = 69 115; ² | **4.78 × 10⁹ (≈ 96.8 dB)** |
| 6 | Pt = 10 mW, f = 950 MHz, d = 5.5 km | Pr | λ = 0.3158 m; 4πd/λ = 218 868; ² = 4.79 × 10¹⁰; Pr = 0.01/4.79 × 10¹⁰ | **2.09 × 10⁻¹³ W** |
| 7 | Pn = 10 µW, Pr = 10 mW | SNR | 10 × 10⁻³ / 10 × 10⁻⁶ = 1000 | **1000 = 30 dB** |
| 8 | SNR = 25 dB, Pn = 20 µW | Pr | SNR = 10^2.5 = 316.2; Pr = 316.2 × 20 × 10⁻⁶ | **6.32 mW** |
| 9 | Lp = 10⁹, d = 3 km | f | Same as Problem 2.6 | **251.6 MHz** |
| 10 | Pt = 95 mW, Pr = 10 µW | Lp | 95 × 10⁻³ / 10 × 10⁻⁶ | **9500 (≈ 39.8 dB)** |

### Free-space loss in dB: worked example 🟦 SUPPLEMENTARY practice
*Free-space loss at 2.4 GHz over 100 m?*
L_dB = 20 log(2.4 × 10⁹) + 20 log(100) − 147.56 = 187.60 + 40 − 147.56 = **80.0 dB**

## 2.10 Noise [WC-S 36–38, WC-B 5.2]

The received signal = transmitted signal + distortions + **noise** (unwanted signals inserted between transmission and reception). **Noise is the major limiting factor in communications system performance.** Four categories:

| Type | Cause | Key facts |
|---|---|---|
| **Thermal noise** | Thermal agitation of electrons | Present in **all** electronic devices and media; a **function of temperature**; uniformly distributed across frequency (**white noise**); **cannot be eliminated**, so it places an **upper bound** on performance; particularly significant for **satellite** communication |
| **Intermodulation noise** | Signals at different frequencies share the same medium | Produces signals at the **sum or difference** of the original frequencies (or multiples) |
| **Crosstalk** | **Unwanted coupling between signal paths** | E.g. hearing another conversation on the phone |
| **Impulse noise** | External EM disturbances (**lightning**), faults and flaws in the system | **Irregular pulses/spikes**, short duration, relatively high amplitude, unpredictable; the **primary source of error in digital data**. A 0.01 s spike barely affects voice but **wipes out ~10 000 bits at 1 Mbps** |

## 2.11 Multipath propagation and its effects ⭐ [WC-S 40–41, WC-B 5.3]

**What it is**: where antennas can't be placed with a clear path (e.g. mobile telephony), the signal is **reflected** (also diffracted and scattered) by obstacles, so **multiple copies with varying delays** reach the receiver. In extreme cases the receiver gets **only reflected signals**. Depending on path-length differences, the composite signal can be **larger or smaller** than the direct signal (**reinforcement or cancellation**).

**Effects of multipath** [WC-S 40, WC-B 5.3]:
1. **Signal level drops**: copies arriving in different phases may add **destructively**. The resulting power can be lower by a factor of 100 or 1000 (**20–30 dB**), the signal falls relative to noise, and detection becomes harder.
2. **Intersymbol interference (ISI)**: delayed copies of a pulse arrive **at the same time as the primary pulse of the next bit**, acting as noise to it. As the mobile moves, the **number, magnitude and timing** of secondary pulses change, which makes ISI hard to filter out.
3. **Rapid signal fluctuations** over a few **centimetres**.

```
Transmitted:   |█|               |█|
               ───────────────────────────► t
Received:      |█| ▄ ▂           |█| ▄ ▂    ◄ multipath echoes
                 └──┴── delayed copies spill into the next bit = ISI
```

*Multipath in a room* [WCP Fig 2.11]: signals reflect off ceiling, floor and obstructions, and the final received signal is the **sum of all received copies with different time delays**. Multipath can cause **high RF signal strength but poor signal quality**. WLAN vendors fight it with **equalisation and antenna diversity**, and may need to operate at **lower data rates** if multipath is severe [WCP].

## 2.12 Fading ⭐ [WC-S 42–43, WC-B 5.3, WCP]

**Fading** is the variation in received signal strength due to multipath, shadowing and movement. In a **fixed** environment it is affected by atmospheric changes such as **rainfall**. In a **mobile** environment the positions of obstacles change over time, creating complex and sometimes rapid effects. The textbook calls it *perhaps the most challenging technical problem facing communications systems engineers*.

**Types listed by the lecturer** [WC-S 43]: fast, slow, flat, selective, Rayleigh, Rician. The slide marks this as **"H/W: study the different types of fading"** [WC-S 42].

### Large-scale vs small-scale fading [WC-B 5.3]

| | **Large-scale fading** | **Small-scale fading** |
|---|---|---|
| Distance scale | Distances **well beyond a wavelength** (passing buildings, vacant lots, intersections) | About **half a wavelength** (at 900 MHz, λ = 0.33 m) |
| Cause | **Shadowing** and changes in distance from the transmitter | **Multipath** combination and **Doppler** (movement) |
| Appearance (Fig 5.7) | **Slowly changing** average power | **Rapid** variations, up to **20–30 dB** over a short distance |

### Two small-scale effects (independent of each other)
**1. Doppler spread → fast vs slow fading** (a **time** effect)
- Characterised by **coherence time Tc**: how long the channel stays roughly constant (e.g. **70 ms pedestrian, 5 ms vehicle at highway speed**).
- Bit time **Tb = 1/rb**.
- **Slow fading**: Tc ≫ Tb, so the channel hardly changes during one bit.
- **Fast fading**: Tc ≤, ≈ or only slightly > Tb, i.e. Tc is **not much greater** than Tb.
- Formula (footnote in textbook): **Tc = 0.423c / (v f)**.

*Worked example* 🟦 SUPPLEMENTARY practice: a car at v = 30 m/s, f = 900 MHz → Tc = 0.423 × 3 × 10⁸ / (30 × 9 × 10⁸) = **4.7 ms**, which agrees with the "5 ms at highway speed" figure.

**2. Multipath fading → flat vs frequency-selective** (a **frequency** effect)
- Characterised by **coherence bandwidth Bc**: the range of frequencies over which the channel response is constant.
- **Flat fading**: **Bc ≫ Bs** (signal bandwidth, Bs ≈ rb). **All frequency components fluctuate in the same proportions simultaneously** ("rise and fall in unison" [WCP]).
- **Frequency-selective fading**: flat fading is **not** present. Attenuation affects **only part** of the signal bandwidth; different frequencies are attenuated and phase-shifted **differently**. This creates **notches** in the frequency response and needs an **equaliser** [WCP].

```
Flat fading:                     Frequency-selective fading:
signal |▓▓▓▓▓▓▓▓|                signal |▓▓▓▓▓▓▓▓|
channel ────────── (flat)        channel ───\_/──── (notch)
output |▒▒▒▒▒▒▒▒| all scaled     output |▓▓▓  ▓▓▓| part of band lost
```

**Four combinations**: fast-flat, slow-flat, fast-frequency-selective, slow-frequency-selective [WC-B 5.3].

🟦 SUPPLEMENTARY (Rayleigh and Rician are listed on [WC-S 43] but not explained in your notes):
- **Rayleigh fading**: a statistical model for **no dominant LOS path**; the signal is the sum of many scattered paths (dense urban, indoor non-LOS).
- **Rician fading**: a statistical model for when there **is a dominant LOS path** plus scattered paths. It is less severe than Rayleigh.

## 2.13 ⭐ Wireless communication problems: the full list [WCP §2.3]

🎯 **This list answers "What are the main problems of signal propagation?" (T1A Q2, 12 marks).** The *Basics of Wireless Networks* notes list ten problems:

1. **Shared media**: the wireless medium offers **lower bandwidth**, so it must be used efficiently.
2. **Increased bit error rate (BER)**: obstacles between Tx and Rx and interference from neighbouring transmitters cause errors, **frequent disconnections** and data loss, especially annoying for voice and video.
3. **Lower radio transmission power**: battery-powered mobiles limit power, and power also limits interference. Signal strength decreases with the **inverse square of distance**. Higher frequencies (3–5 GHz) increase attenuation and reduce range.
4. **Scattering**: the medium contains objects **small compared to the wavelength**, many per unit volume (rough surfaces, small objects); needs correct deployment (placement, antenna selection).
5. **Reflection**: the wave strikes an object **very large compared to the wavelength** (walls, furniture, building structure).
6. **Diffraction**: the path is obstructed by a surface with **sharp irregularities (edges)**; secondary waves exist even **behind** the obstacle.
7. **Multipath propagation**: reflection and scattering mean waves arrive from many directions with different delays and **combine vectorially**. Movement causes **Doppler shift**. The result can be high RF strength but poor quality. **Indoor is especially bad.** Countered by **equalisation, antenna diversity, lower data rates**.
8. **Fading**: often caused by multipath; **degrades BER**. Flat vs frequency-selective (above).
9. **Path loss**: key for design. It determines **transmit power, receiver sensitivity and SNR**. Indoors it is roughly **20 dB per 100 ft**. Multipath fading effectively increases it. **Main countermeasure: add more access points** for coverage.
10. **RF signal interference**: vulnerable to **atmospheric noise** and **transmissions from other systems**.
    - **Inward interference** (**co-channel**): from harmonics of other transmitters or products using similar frequencies, e.g. **microwave ovens at 2.4 GHz**, which block transmissions or cause bit errors.
    - **Outward interference** (**adjacent channel**): a WLAN's signal disrupts **other** systems (adjacent WLANs, aircraft navigation).
    - Interference is uncommon in spread-spectrum WLAN bands because power is low (< 1 W); devices must be **very close and in the same band**.

## 2.14 ⭐ Model answer framework: Path loss vs multipath vs interference
🎯 **Asked in: Exam Q1(a) (6), T1A Q3 (9), T1B Q4 (12).** Full answers will be in Part 5, but here is the core comparison you must know:

| | **Path loss** | **Multipath propagation** | **Interference from other sources** |
|---|---|---|---|
| **What it is** | Reduction of signal power as it travels from Tx to Rx | Signal reaches the receiver by **several paths** (reflection, diffraction, scattering) with different delays and phases | **Unwanted signals from other transmitters** add to the wanted signal |
| **Cause** | Signal **spreading over distance** (free-space loss ∝ (4πd/λ)²); absorption, obstruction | Obstacles: buildings, walls, ground, ceiling, small objects | Other devices using the **same or nearby frequencies**: co-channel (same channel), adjacent channel, microwave ovens, other WLANs/Bluetooth |
| **Depends on** | **Distance** and **frequency** (path loss exponent n of the environment) | **Environment geometry** and **movement** | **Other users/devices** nearby; not related to the wanted signal's path |
| **Behaviour** | **Predictable, deterministic**, smooth decrease with distance | **Random, time-varying**; constructive/destructive addition, rapid fluctuations (fading), ISI, Doppler | **Random/bursty**, depends on others' activity |
| **Effect** | Weak signal → low SNR → limited range | **Fading** (20–30 dB dips), **ISI**, distortion, high strength but poor quality | Lower **SINR**, bit errors, collisions, blocked transmissions |
| **Countermeasures** | Higher Tx power, higher antenna gain, more APs/cells, lower frequency | **Equalisation, diversity/MIMO, OFDM, spread spectrum, FEC** | **Channel planning** (use different channels), spread spectrum, directional antennas, power control, remove the source |

## 2.15 Examination focus — Topic 2

**Real past-paper questions from this topic**

| Question | Paper(s) | Marks |
|---|---|---|
| Explain the three basic propagation mechanisms in a mobile communication system | T1A Q1, T1B Q3 | 12, 12 |
| Main problems of signal propagation? Why don't radio waves always follow a straight line? Why is reflection both useful and harmful? | T1A Q2 | 12 |
| Differences between path loss, multipath propagation and interference from other sources | Exam Q1(a), T1A Q3, T1B Q4 | 6, 9, 12 |
| Distance between Tx (850 MHz, 125 mW) and Rx (1 µW) | T1A Q14 | 6 |
| A receiving site has occasional loss of signal due to interference; steps to correct it | T1A Q12, T2-2025 Q6 | 10, 10 |
| Why many WiFi networks have a high error rate caused by co-channel interference | T1A Q13 | 4 |

**Lecturer's own review questions** [WC-S 72]: three propagation mechanisms; **attenuation, dispersion and noise**; FD-MIMO and beamforming; SU-MIMO vs MU-MIMO; channel correction mechanisms; three bandwidth expansion approaches.

**Quick prep for "Why don't radio waves always follow a straight line? Why is reflection both useful and harmful?"** (T1A Q2). Draft answer, which Part 5 will expand:
- **Not a straight line**: waves **refract** (bend when the density of the medium changes; ionospheric refraction for sky waves), **diffract** around sharp edges, **scatter** off small objects, **reflect** off large surfaces, and ground waves follow the Earth's curvature.
- **Reflection useful**: it lets the signal reach a receiver with **no LOS** (around buildings, indoors) and provides **multiple copies** that diversity/MIMO can combine.
- **Reflection harmful**: reflected copies arrive **delayed and phase-shifted**, causing **destructive interference (fading)**, **ISI** and **distortion**. A ground reflection can cancel the LOS wave.

🟦 SUPPLEMENTARY: **dispersion** (asked in the lecturer's review list but not defined in your notes) is the **spreading of a pulse in time**. Different components travel at different speeds or by different path lengths (e.g. multipath delay spread), so pulses widen and overlap, causing ISI.

## 2.16 Topic 2 revision summary
- Spectrum is regulated (FCC; **ICASA** in SA). Licensing leaves spectrum underused, hence **DSA and cognitive radio**. **ISM bands** are licence-free but have **no protection from interference**.
- Propagation modes: **ground wave (<3 MHz, AM)**, **sky wave (3–30 MHz, ionosphere)**, **LOS (>30 MHz)**.
- **Five mechanisms**: free space, transmission, reflection (large objects), diffraction (sharp edges), scattering (small objects). **The three mobile mechanisms: reflection, diffraction, scattering.**
- Antennas: radiation pattern, main lobe, sidelobes, nulls, beam width; isotropic vs directional.
- **Free space loss: Pt/Pr = (4πd/λ)² = (4πfd/c)².** In dB: 20 log f + 20 log d − 147.56. **Path loss exponent n**: free space 2, urban 2.7–3.5, obstructed in-building 4–6. Okumura–Hata model.
- Calculations: **Pr = Pt/(4πd/λ)²; λ = c/f; SNR = Pr/Pn; Lp = Pt/Pr.** Watch out for the errors in the notes (Problems 2.3, 2.5, 2.7).
- **Noise**: thermal (cannot be eliminated), intermodulation, crosstalk, impulse (main cause of digital errors).
- **Multipath** → destructive addition (20–30 dB), **ISI**, rapid fluctuations.
- **Fading**: large-scale (shadowing) vs small-scale. **Fast/slow** depends on coherence time vs bit time; **flat/frequency-selective** depends on coherence bandwidth vs signal bandwidth.
- Ten wireless problems: shared media, high BER, low power, scattering, reflection, diffraction, multipath, fading, path loss, interference (inward/co-channel, outward/adjacent).

---
---

# TOPIC 3 — CHANNEL CORRECTION MECHANISMS AND CAPACITY

## 3.1 Introduction

Topic 2 showed what goes wrong in the wireless channel. This topic covers the **techniques systems use to compensate for the errors and distortions introduced by multipath fading**, and the ways to get **more capacity** when one channel is not enough [WC-S 44, WC-B 5.4]. In the mobile environment, **techniques from all categories are combined** [WC-B 5.4].

**The lecturer's list of channel correction mechanisms** [WC-S 44]:
1. Forward error correction (FEC)
2. Adaptive equalization
3. Adaptive modulation and coding (AMC)
4. Diversity techniques and MIMO
5. OFDM
6. Spread spectrum
7. Bandwidth expansion

(OFDM and spread spectrum get full treatment in Part 2.)

## 3.2 Key definitions

| Term | Definition | Source |
|---|---|---|
| **Forward error correction (FEC)** | The receiver, **using only information in the incoming transmission**, corrects bit errors. | [WC-B 5.4] |
| **Backward error correction (ARQ)** | The receiver **only detects** errors and **requests retransmission**. | [WC-B 5.4], [WC-S 69] |
| **Adaptive equalization** | Gathering **dispersed symbol energy back into its original time interval**; used to combat ISI. | [WC-S 47] |
| **Diversity** | Combats fading by providing **multiple independent copies** of the same signal to the receiver, because individual channels experience **independent fading** events. | [WC-S 48] |
| **MIMO** | A transmitter and receiver with **multiple antennas**. | [WC-B 5.4] |
| **Adaptive modulation and coding (AMC)** | **Dynamically adjusting** the modulation scheme and coding rate based on the current channel conditions. | [WC-S 51] |
| **Bandwidth expansion** | Approaches used when the needed throughput exceeds what the bps/Hz of a channel allows: carrier aggregation, frequency reuse, mmWave. | [WC-S 52] |

## 3.3 Forward error correction (FEC) [WC-S 45–46, WC-B 5.4]

**Applicable to**: digital transmission carrying digital data, digitized voice or video.

**How it works** (Figure 5.15, the FEC process):
1. The transmitter uses a coding algorithm to **add redundant bits** (an error-correcting code) to each data block. These bits are a **function of the data bits**.
2. For each incoming block, the receiver **calculates a new code** from the received data bits.
3. If the calculated code **matches** the received code, it assumes **no error**.
4. If they **don't match**, one or more bits are in error. If the number of errors is **below a threshold** (which depends on code length and algorithm), the receiver can **locate and correct** the bits.

```
Tx: data ──► [FEC encoder] ──► data + check bits ──► channel (errors) ──►
Rx: ──► [FEC decoder: recompute, compare] ──► corrected data (no request back to Tx)
```

**Overhead**: in mobile wireless the ratio **total bits / data bits is typically 2–3**, so capacity is cut to ½ or ⅓. This looks extravagant, but the mobile channel is so hostile that the redundancy is necessary.

### ⭐ Why backward error correction (ARQ) is not used in wireless [WC-S 45]
Backward error correction is not practical in many wireless applications:
- **Satellite communications**: the **delay** is so large that retransmission is undesirable.
- **Mobile communications**: **error rates are so high** that a retransmitted block is **likely to contain errors too**.

So **FEC is required** in these applications.

🟦 SUPPLEMENTARY nuance: ARQ is still used in wireless at higher layers or alongside FEC (802.11 uses ACK + retransmission; Bluetooth uses both FEC and ARQ, see Part 3). The point is that *ARQ alone* is not enough.

## 3.4 Adaptive equalization [WC-S 47, WC-B 5.4]
- Can be applied to **analog** (voice, video) **or digital** (data, digitized voice/video) information.
- Used to **combat intersymbol interference (ISI)**.
- **Gathers the dispersed symbol energy back into its original time interval.**
- **Techniques**: **lumped analog circuits**, or **sophisticated digital signal processing (DSP) algorithms**.
- "Adaptive": the equaliser **continually adjusts** as the channel changes. Equalisation tries to restore the flat-fading nature of the channel, which allows **higher data rates** before ISI appears [WCP].

🟦 SUPPLEMENTARY: equalisers become complex and expensive as ISI becomes more severe. This is one reason OFDM (Part 2) is attractive: with long OFDM symbols, an equaliser may not be needed [OFDM notes].

## 3.5 Diversity techniques ⭐ [WC-S 48, WC-B 5.4]

**Principle**: individual channels experience **independent fading**, e.g. antennas spaced far enough apart. So provide **multiple logical channels** and send part of (or a copy of) the signal on each. Diversity **does not eliminate errors, but reduces the error rate**, because it avoids being exposed to the worst error rate. FEC and equalisation then cope with the reduced error rate.

| Type | Idea | Examples |
|---|---|---|
| **Space diversity** | Uses the **physical transmission path**: multiple antennas spaced apart | Several nearby antennas whose signals are combined; **collocated directional antennas** pointing at different angles |
| **Frequency diversity** | Spread the signal over a **larger bandwidth** or **multiple carriers** | **OFDM**, **spread spectrum (DSSS, FHSS)** |
| **Time diversity** | Spread the data **out over time** so a **noise burst affects fewer bits** | **Interleaving**, **Rake receiver** |

**Using the multiple received signals**:
1. **Selection diversity**: choose the **best** (or an acceptable) signal.
2. **Combining diversity**: **combine** the signals, adjusting gain and phase so they **add together** to improve the output.

## 3.6 MIMO (multiple-input multiple-output) ⭐ [WC-S 49–50, WC-B 5.4]

A system where the transmitter **and** receiver have **multiple antennas**. Antenna arrays are used for **four purposes** (Figure 5.9):

| Use | What it does | Benefit (Fig 5.9 caption) |
|---|---|---|
| **1. Diversity** | Multiple received copies via multiple Tx and/or Rx antennas | **Improved system performance** |
| **2. Beamforming** | Antennas configured to create **directional patterns**, focusing energy on intended recipients | **Improved coverage** (fewer cells for a given area) |
| **3. Multi-user MIMO (MU-MIMO)** | With enough antennas, **directional beams to multiple users simultaneously** (spatial division multiple access) | **Improved capacity** (more users per cell) |
| **4. Multilayer transmission (SU-MIMO)** | **Multiple parallel data streams** between **one pair** of transmitter and receiver | **Higher data rates** in a given bandwidth |

**Sizes**: modern systems use **4 × 4** (4 Tx, 4 Rx) and **8 × 8**; 2-D arrays of **64 antennas** are envisioned; the future is **massive MIMO**. MIMO and OFDM together are the **cornerstone of broadband wireless** (802.11n/ac/ax Wi-Fi, 4G LTE).

### ⭐ SU-MIMO vs MU-MIMO
🎯 **Asked in: T1B Q9 (8 marks); also lecturer's review list [WC-S 72].**

| | **Single-user MIMO (SU-MIMO)** | **Multi-user MIMO (MU-MIMO)** |
|---|---|---|
| Who | All spatial streams go between the base station/AP and **one user** at a time | Streams/beams go to **several different users simultaneously** |
| Technique | **Multilayer transmission**: parallel data streams over the same frequency/time | **Directional beams (beamforming)** to each user = **SDMA** |
| Goal | **Higher data rate** (peak throughput) for that user | **Higher capacity**: more users per cell |
| Requirement | The user device must have **multiple antennas** | Users can have **single antennas**; the BS/AP needs **enough antennas** to form a beam per user and must know each user's channel |
| Fig 5.9 label | "Multilayer transmission (SU-MIMO) for higher data rates in a given bandwidth" | "Spatial division multiple access (MU-MIMO) for improved capacity (more users per cell)" |

🟦 SUPPLEMENTARY: **FD-MIMO** (full-dimension MIMO, asked in the lecturer's review list) uses a **2-D antenna array** (e.g. the 64-antenna arrays in the notes) so beams can be steered in **both horizontal and vertical (elevation)** directions, e.g. to different floors of a tall building. **Beamforming** = adjusting the phase/amplitude of each antenna's signal so they add up constructively in the wanted direction and cancel elsewhere.

## 3.7 Adaptive modulation and coding (AMC) [WC-S 51, WC-B 5.4]

**Definition**: dynamically adjusting the **modulation scheme** and **coding rate** based on the **current channel conditions**.
- **Modulation** formats the signal to best transmit bits: to **overcome noise** and to **send as many bits as possible**.
- **Coding** **detects and corrects** errors.
- The channel can change **hundreds of times per second** (e.g. **200 times/s for a 5 ms coherence time**), so AMC must adapt equally fast.

**Two features needed in the protocol** [WC-B 5.4]:
1. **Mechanisms to measure channel quality**: packet loss rates, or **pilot signals** sent specifically for measurement.
2. **Messaging mechanisms** to send channel-quality indicators between Tx and Rx and to communicate the **new modulation and coding formats**.

*Practical meaning*: good channel → high-order modulation (e.g. 64-QAM) and light coding → high rate. Bad channel → robust modulation (e.g. BPSK/QPSK) and heavy coding → lower rate but reliable. This is the same idea as **rate adaptation** in 802.11 [WLAN slide 23].

## 3.8 Spread spectrum and OFDM: preview [WC-B 5.4]
Traditional systems just shift a baseband signal up to a carrier. Two methods **significantly modify the signal** to beat channel impairments:
- **OFDM** splits a signal into **many lower bit-rate streams** on **carefully spaced frequencies**. Each stream uses **much lower bandwidth with longer bit times**, which overcomes **frequency-selective fading**.
- **Spread spectrum** makes the signal use **100 times or more** wider bandwidth with **lower energy density** at each frequency. Even if some frequencies are poor, **average performance** is good.

*(Both are covered in full in Part 2.)*

## 3.9 Bandwidth expansion ⭐ [WC-S 52–53, WC-B 5.4]

All the correction mechanisms try to increase efficiency in **bps/Hz**, but **Shannon limits** the efficiency for a given SNR. If throughput must exceed what a bandwidth allows, use bandwidth expansion:

| Approach | How it works | Examples / issues |
|---|---|---|
| **1. Carrier aggregation** | **Combine multiple channels** into one wider channel | 802.11n/ac combine 20 MHz channels into **40, 80 or 160 MHz**; **4G LTE combines carriers** (Fig 14.14) |
| **2. Frequency reuse** | **Limit propagation range** to an area and **reuse the same frequencies** where devices are far enough apart that interference is low | Traditional **macro cells** (km diameter); now **small cells**: indoor **femtocells**, outdoor **picocells/relays**, called **network densification** |
| **3. Millimeter wave (mmWave)** | Use **higher carrier frequencies (30–300 GHz)**, where wider channels are available; wavelengths 10 mm–1 mm (λ = c/f) | More bandwidth, **but** expensive, and **susceptible to obstructions and atmospheric absorption**; 802.11ad uses mmWave within a single room |

🎯 **Lecturer's review question [WC-S 72]: "Discuss three bandwidth expansion approaches"**. The answer is this table.

### Capacity: "Three methods to increase the capacity of a wireless communication system"
🎯 **Asked in: T1B Q5 (12 marks).** Your notes support these answers. Choose **three** and explain each well (Part 5 will give the full model answer):
1. **Bandwidth expansion**: carrier aggregation, mmWave (above).
2. **Frequency reuse / smaller cells (network densification)**: the same frequencies are reused many times [WC-B 5.4]. Note also the SDMA advantage: moving from a 7-cell to a 4-cell reuse pattern **nearly doubles capacity** [MA p9].
3. **MIMO**: SU-MIMO multilayer transmission (higher data rate in the same bandwidth) and MU-MIMO/SDMA (more users per cell) [WC-B 5.4].
4. **Efficient multiple access**: CDMA gives capacity **8–10× analog** and **4–5× other digital** systems [MA p6]; OFDMA [Part 2].
5. **Adaptive modulation and coding**: send as many bits as possible for the current channel [WC-S 51].

## 3.10 Examination focus — Topic 3

| Question | Source |
|---|---|
| What distinguishes SU-MIMO from MU-MIMO? (8) | T1B Q9; [WC-S 72] |
| Discuss three methods to increase the capacity of a wireless system (12) | T1B Q5 |
| As a mobile node moves farther from a BS, what two actions could the BS take so that the frame loss probability does not increase? (4 / 2) | T1A Q7, Exam Q5(a) |
| Explain FEC, adaptive equalization, AMC, diversity with MIMO | [WC-S 72] |
| Describe FD-MIMO and beamforming | [WC-S 72] |
| Three bandwidth expansion approaches | [WC-S 72] |
| Why is backward error correction not used in wireless? | [WC-S 45] |

**Preview for the "mobile node moves away" question** (T1A Q7 / Exam Q5(a)), which draws on this topic. Full answer in Part 5:
1. **Increase transmission power** to compensate for the larger path loss (free-space loss grows with d²).
2. **Reduce the transmission rate**: switch to a **more robust modulation and stronger coding** (AMC / rate adaptation), which tolerates a lower SNR.
*(Other valid options from your notes: use beamforming/directional antennas toward the node, or add FEC/retransmissions.)*
🟦 SUPPLEMENTARY: this question comes from Kurose & Ross (Ch. 7). Their model answer is exactly "increase transmit power" and "reduce the transmission rate".

## 3.11 Topic 3 revision summary
- **Seven correction mechanisms**: FEC, adaptive equalisation, AMC, diversity/MIMO, OFDM, spread spectrum, bandwidth expansion.
- **FEC**: add redundant bits; receiver corrects without retransmission; overhead ratio 2–3. **ARQ is impractical**: satellite delay; high mobile error rates mean retransmissions also fail.
- **Equalisation**: combats **ISI** by gathering dispersed energy back into the symbol's interval (analog circuits or DSP).
- **Diversity**: independent fading. **Space, frequency (OFDM, SS), time (interleaving, Rake).** Selection vs combining.
- **MIMO, four uses**: diversity (performance), beamforming (coverage), **MU-MIMO (capacity, more users)**, **SU-MIMO multilayer (data rate)**. 4×4, 8×8, massive MIMO.
- **AMC**: adapt modulation/coding hundreds of times per second; needs channel measurement and signalling.
- **Bandwidth expansion**: carrier aggregation, frequency reuse (small cells/densification), mmWave (30–300 GHz).

---
---

# TOPIC 4 — SIGNAL ENCODING TECHNIQUES (DIGITAL-TO-ANALOG MODULATION)

## 4.1 Introduction

Wireless channels carry **analog** electromagnetic waves, but our data are **digital** bits. **Digital-to-analog conversion (modulation)** changes a characteristic of a high-frequency **carrier** wave according to the data, so bits can travel through the air [SE]. Modulation also lets many transmitters **share a channel** (FDM) and makes **antennas of practical size** possible [WC-S 55–56].

## 4.2 Key definitions

| Term | Definition | Source |
|---|---|---|
| **Digital-to-analog conversion** | Changing one of the characteristics of an analog signal based on the information in digital data. | [SE] |
| **Modulation** | Shifts the spectrum of a baseband signal to some high frequency. **Bandpass modulation** varies some characteristic of a sinusoidal waveform according to the message signal. | [WC-S 55] |
| **Carrier signal** | A high-frequency signal produced by the sender that acts as a **base for the information signal**; the receiver is tuned to it. | [SE] |
| **Data element** | Smallest piece of information exchanged: **the bit**. | [SE] |
| **Signal element** | Smallest unit of a signal that is **constant**. | [SE] |
| **Bit rate (N)** | Number of bits per second. | [SE] |
| **Baud rate (S)** | Number of **signal elements per second**. In analog transmission of digital data, **baud rate ≤ bit rate**. | [SE] |
| **Bit error rate (BER)** | Better called **bit error probability**. It is **not a rate in bits/s but a probability**. | [WC-S 67] |

## 4.3 Why modulate? [WC-S 55–56]
1. **Antenna size**: antenna size is inversely proportional to frequency (an efficient antenna is about λ/4).
   - Speech f = 3 kHz → λ = c/f = (3 × 10⁸)/(3 × 10³) = 10⁵ m → λ/4 = **25 km (≈ 15 miles)**, which is practically unrealisable.
   - Same speech modulated onto **fc = 900 MHz** → λ = 0.333 m → λ/4 ≈ **8 cm**.
2. **Channel sharing**: modulation onto different carriers lets several transmitters share a channel (**FDM**).
3. Most channels require the baseband signal to be **shifted to a higher frequency**.

## 4.4 Bit rate vs baud rate [SE]

```
S = N / r          where  r = log₂ L
```
- **S** = baud rate (signal elements/s); **N** = bit rate (bps); **r** = number of bits carried per signal element; **L** = number of different signal elements.
- Analogy from the notes: **a baud is a vehicle, a bit is a passenger**. Put more people in each car (more bits per signal element) to reduce traffic (baud rate, and therefore bandwidth).

#### Worked example B1 🟦 SUPPLEMENTARY practice
*An analog signal carries 4 bits per signal element and the bit rate is 8000 bps. Find the baud rate.*
r = 4 → S = N/r = 8000/4 = **2000 baud**.

#### Worked example B2 🟦 SUPPLEMENTARY practice
*16-QAM at 1000 baud: bit rate?* L = 16 → r = log₂16 = 4 → N = S × r = **4000 bps**.

**Bandwidth** [SE]: the required bandwidth for analog transmission of digital data is **proportional to the signal (baud) rate**, except for **FSK**, where the **difference between the carriers** must be added.

## 4.5 The three basic methods

A sine wave has **three characteristics: amplitude, frequency and phase**. Changing any one creates a different version of the wave, which gives three basic modulation methods. A fourth, **QAM**, combines amplitude and phase changes and is the **most efficient** and most common today [SE, WC-S 57].

```
Data:     1      0      1      1
ASK:   ∿∿∿∿  ______  ∿∿∿∿  ∿∿∿∿     (carrier on / off: amplitude changes)
BFSK:  ∿∿∿∿  ∿ ∿ ∿   ∿∿∿∿  ∿∿∿∿     (high freq for 1 / lower freq for 0)
BPSK:  ∿∿∿∿  ∽∽∽∽  ∿∿∿∿  ∿∿∿∿     (phase flips 180° for 0)
```

### 4.5.1 Amplitude-shift keying (ASK) [WC-S 59–60, SE]
**Definition**: the **amplitude** of the carrier is varied to create signal elements; frequency and phase stay constant.

**Binary ASK / on-off keying (OOK)**: one binary digit = **presence of the carrier at constant amplitude**, the other = **absence of the carrier**:
```
s(t) = A cos(2πfc t)   for binary 1
     = 0               for binary 0
```
- **Implementation**: multiply a **unipolar NRZ** signal (1 V / 0 V) by the carrier from an oscillator [SE].
- **Disadvantages**: **susceptible to sudden gain changes** (noise easily changes amplitude); **inefficient**.
- **Use**: transmitting digital data over **optical fibre** (the light source on/off).

### 4.5.2 Frequency-shift keying (FSK) [WC-S 61–63, SE]
**Definition**: the **frequency** of the carrier is varied to represent data; amplitude and phase stay constant. The frequency is constant for one signal element and changes when the data changes.

**Binary FSK (BFSK)**, the most common form: two binary values = **two different frequencies near the carrier**:
```
s(t) = A cos(2πf₁t)   for binary 1
     = A cos(2πf₂t)   for binary 0
```
f₁ and f₂ are **offset from fc by equal but opposite amounts** (fd). The two bands are centred on f₁ and f₂, each Δf from the midpoint, so the **difference between the frequencies is 2Δf** [SE].

- **Advantages**: **less susceptible to error than ASK**.
- **Uses**: high-frequency radio (**3–30 MHz**); higher frequencies on LANs using **coaxial cable**.
- **Implementation** [SE]:
  - **Noncoherent BFSK**: phase may be **discontinuous** at element boundaries; implemented as **two ASK modulations with two carriers**.
  - **Coherent BFSK**: phase **continues** across boundaries; implemented with one **voltage-controlled oscillator (VCO)**, whose frequency rises when the NRZ input is positive.

**Multiple FSK (MFSK)**: more than two frequencies are used [WC-S 63]:
```
sᵢ(t) = A cos(2πfᵢt),   1 ≤ i ≤ M
fᵢ = fc + (2i − 1 − M) fd
```
fc = carrier frequency; fd = difference frequency; **M = 2ᴸ** (number of signal elements); L = bits per element.
- **More bandwidth efficient but more susceptible to error** [WC-S 63].
- Forouzan's version [SE]: MFSK **uses more bandwidth** than other techniques and should be used **when noise is a serious issue**.

> 🟦 SUPPLEMENTARY (reconciling the two statements): Stallings means MFSK sends more bits per *signal element* than BFSK. Forouzan compares MFSK to ASK/PSK, where MFSK needs more *total* bandwidth because each frequency needs its own band. If asked, say: "MFSK carries more bits per signal element, but needs a wider band than PSK/QAM; it is robust to noise."

#### Worked example F1 🟦 SUPPLEMENTARY practice, using the lecturer's formula
*MFSK with fc = 250 kHz, fd = 25 kHz, M = 8 (L = 3 bits). List the frequencies.*
fᵢ = 250 + (2i − 1 − 8) × 25 kHz = 250 + (2i − 9) × 25
- i = 1: 250 − 175 = **75 kHz**; i = 2: **125**; i = 3: **175**; i = 4: **225**; i = 5: **275**; i = 6: **325**; i = 7: **375**; i = 8: **425 kHz**.
- The frequencies are spaced 2fd = 50 kHz apart; total bandwidth ≈ 2M·fd = **400 kHz**.

### 4.5.3 Phase-shift keying (PSK) [WC-S 64–65, SE]
**Definition**: the **phase** of the carrier is shifted to represent data; amplitude and frequency stay constant. **Today PSK is more common than ASK or FSK** [SE].

**Binary PSK (BPSK)**: two phases, **0° and 180°**:
```
s(t) = A cos(2πfc t)        for binary 1
     = A cos(2πfc t + π)    for binary 0     (= −A cos(2πfc t))
```
- **Advantages** [SE]:
  - **Less susceptible to noise than ASK**: noise changes amplitude more easily than phase.
  - **Superior to FSK**: does not need two carriers.
  - Bandwidth is **the same as binary ASK and less than BFSK**, since no bandwidth is wasted separating two carriers.
- **Disadvantage**: needs **more sophisticated hardware** to distinguish phases.
- **Implementation**: multiply a **polar NRZ** signal (+V = 1, −V = 0) by the carrier [SE].

**Quadrature PSK (QPSK)**: **four phases, each element represents 2 bits** [WC-S 65]:
```
s(t) = A cos(2πfc t + π/4)     for 11
     = A cos(2πfc t + 3π/4)    for 01
     = A cos(2πfc t − 3π/4)    for 00
     = A cos(2πfc t − π/4)     for 10
```
- Built from **two BPSK modulators**, one **in-phase (I)** and one **quadrature (Q, 90° out of phase)**. A serial-to-parallel converter sends alternate bits to each [SE].
- Each BPSK branch gets bits of duration **2T** (half the rate). The sum of the two is a sine wave with one of **four phases: ±45°, ±135°** [SE].
- **L = 4, r = 2**, so **baud rate = half the bit rate**, which lowers the required bandwidth.

### 4.5.4 Quadrature amplitude modulation (QAM) [SE, WC-S 66]
- PSK is limited by how well equipment can **distinguish small phase differences**.
- **QAM = combination of ASK and PSK**: two carriers (in-phase and quadrature), each with **different amplitude levels**.
- Variations [SE Fig 5.14]: 4-QAM with unipolar NRZ (like OOK); **4-QAM with polar NRZ = QPSK**; 4-QAM with two positive levels; **16-QAM** (8 levels, 4 positive and 4 negative), shown in the **16-QAM constellation diagram** [WC-S 66].
- **Most efficient** digital-to-analog method; **dominant method** today; used by 802.11a/g OFDM subcarriers (Part 3).

```
16-QAM constellation (each dot = one 4-bit symbol)
      Q
  •  •  |  •  •
  •  •  |  •  •
 ───────┼───────── I
  •  •  |  •  •
  •  •  |  •  •
```

## 4.6 Comparison of modulation schemes 🟦 (assembled from [SE] and [WC-S 59–65])

| Scheme | What varies | Bits/symbol | Noise robustness | Bandwidth | Notes |
|---|---|---|---|---|---|
| ASK (OOK) | Amplitude | 1 | **Worst**: sensitive to gain changes | Same as BPSK | Simple; optical fibre |
| BFSK | Frequency | 1 | Better than ASK | **More** (two carriers + gap 2Δf) | HF radio 3–30 MHz, coax LANs |
| MFSK | Frequency (M values) | log₂M | Robust to noise | Wide | Use when noise is serious |
| BPSK | Phase (0°/180°) | 1 | **Better than ASK** | Same as ASK, less than BFSK | Needs complex hardware |
| QPSK | Phase (4 values) | 2 | Good | Half of BPSK for the same bit rate | Two BPSK in quadrature |
| QAM | Amplitude **and** phase | log₂L (e.g. 4 for 16-QAM) | Less robust as L grows (points closer) | Most efficient | Dominant today |

🎯 **"Which of ASK, FSK, PSK, QAM is most susceptible to noise? Defend your answer."** [SE Exercise 13]
**Answer: ASK.** Its data is carried **only by amplitude**, and noise is additive, so it directly changes the amplitude. FSK and PSK carry data in frequency and phase, which noise disturbs much less. *(QAM also uses amplitude, so it is more noise-sensitive than PSK at high orders, but ASK is the classic answer because it relies on amplitude alone.)*

## 4.7 Bit error rate (BER) and Eb/N0 [WC-S 67–68]
- Performance must be assessed **in the presence of noise**.
- "**Bit error probability**" is a clearer term: **BER is not bits/s but a probability**.
- Plotted with **log-scale BER on the y-axis** and **Eb/N0 in dB on the x-axis** (Eb/N0 = energy per bit / noise power spectral density).
- **As Eb/N0 increases, BER drops.**
- **Curves to the lower left are better**: **lower BER at the same Eb/N0**, or **lower Eb/N0 for the same BER**.
- Figure 5.12 compares multilevel FSK, PSK and QAM. 🟦 SUPPLEMENTARY reading of that figure: for **PSK and QAM**, increasing M (more bits per symbol) **needs more Eb/N0** for the same BER. For **MFSK**, increasing M **reduces** the Eb/N0 needed, at the cost of more bandwidth. This trade-off is why AMC picks the modulation order according to channel quality.

## 4.8 Coding and error control: preview [WC-S 69–71]
- **Error detection codes** detect the **presence** of an error.
  - With **ARQ (automatic repeat request)**, a block with an error is **discarded** and the transmitter **retransmits** it.
- **Error correction codes (FEC)** are designed to **detect and correct** errors.
- **Error detection process** [WC-S 70]:
  - **Transmitter**: for each frame, compute an error-detecting code (**check bits**) from the data bits and **append** them.
  - **Receiver**: separate data and check bits, **recompute** the check bits from the received data, **compare**. A **mismatch = detected error**.

*(Parity, checksum, Hamming and CRC calculations are fully covered in Part 2, Topic 8.)*

## 4.9 Examination focus — Topic 4

**Lecturer's exercise list** [SE] (likely short questions):
1. Define carrier signal and its role → see 4.2.
2. Function of **scrambling** in digital-to-digital encoding 🟦 SUPPLEMENTARY: replaces long runs of 0s with special patterns so the receiver keeps **synchronisation**, without increasing bandwidth (e.g. B8ZS, HDB3).
3. What does a **modem** do? → converts digital data to an analog signal by modulating a carrier, and back again [TF-B 20].
4. How are binary values represented in ASK, and the limitation → presence/absence of carrier; susceptible to sudden gain changes, inefficient.
5. QPSK vs **offset QPSK** 🟦 SUPPLEMENTARY: OQPSK delays the Q stream by **half a symbol (one bit time)**, so I and Q never change together. This avoids 180° phase jumps and gives smaller envelope fluctuations (better for power amplifiers).
6. What is QAM? → combination of ASK and PSK (4.5.4).
7. Sampling theorem 🟦 SUPPLEMENTARY: sample at **at least twice the highest frequency** (Nyquist rate). Compare the T1 example: voice is sampled at 8 kHz [Access Tech article].
8. Angle modulation, PM and FM 🟦 SUPPLEMENTARY: angle modulation varies the carrier's angle. **FM** varies frequency in proportion to the message amplitude; **PM** varies phase in proportion to the message. Both are forms of angle modulation.
9. **DPSK** 🟦 SUPPLEMENTARY: differential PSK. The bit is represented by a **change or no change in phase** relative to the previous symbol, so no absolute phase reference is needed. (Bluetooth EDR uses π/4-DQPSK and 8DPSK, Part 3.)
10. Encode **01100** with ASK, BFSK and BPSK → see the sketch below.
11–14. PCM vs DM, modem vs codec 🟦 SUPPLEMENTARY: **PCM** samples and quantises each sample into n bits. **DM (delta modulation)** sends 1 bit per sample (up or down a step). PCM gives better quality; DM is simpler but suffers slope overload and granular noise. A modem and a codec are **not functional inverses**: a modem maps *digital data → analog signal*; a codec maps *analog data → digital signal*.
13. Most susceptible to noise → **ASK** (4.6).

**Exercise 10 sketch: encode 01100**
```
Bit:      0       1       1       0       0
ASK:   ______  ∿∿∿∿∿∿  ∿∿∿∿∿∿  ______  ______     (no carrier for 0, carrier for 1)
BFSK:  ∿ ∿ ∿   ∿∿∿∿∿∿  ∿∿∿∿∿∿  ∿ ∿ ∿   ∿ ∿ ∿      (f2 low for 0, f1 high for 1)
BPSK:  ∽∽∽∽∽∽  ∿∿∿∿∿∿  ∿∿∿∿∿∿  ∽∽∽∽∽∽  ∽∽∽∽∽∽     (phase π for 0, phase 0 for 1)
```
In BPSK, draw a **phase reversal** (the wave flips upside down) at each 0↔1 boundary: between bits 1–2 and 3–4. There is no reversal between bits 2–3 or 4–5.

## 4.10 Topic 4 revision summary
- Modulation shifts a baseband signal to a carrier: **small antennas** (λ/4: 25 km at 3 kHz vs 8 cm at 900 MHz) and **channel sharing**.
- **S = N/r, r = log₂L**: baud ≤ bit rate. Bandwidth ∝ baud rate (FSK adds the carrier separation).
- **ASK/OOK**: amplitude; simple, noise-sensitive, inefficient; optical fibre.
- **BFSK**: two frequencies ±fd; better than ASK; HF radio. **MFSK**: fᵢ = fc + (2i−1−M)fd.
- **BPSK**: 0°/180°; better than ASK in noise; same bandwidth as ASK. **QPSK**: 4 phases (±45°, ±135°), 2 bits/symbol, I and Q branches.
- **QAM** = ASK + PSK; most efficient; 16-QAM constellation.
- **BER** is a probability. BER vs Eb/N0: lower-left curves are better.
- **Error detection**: append check bits, recompute, compare. **ARQ** retransmits; **FEC** corrects.

---

## What comes next

**Part 2** covers Topic 5 (multiple access: FDMA, TDMA, CDMA, SDMA, cellular generations), Topic 6 (spread spectrum: FHSS, DSSS, why CDMA is hard to jam), Topic 7 (OFDM, OFDMA, SC-FDMA) and Topic 8 (error detection and correction: parity, checksum, Hamming and CRC, all worked step by step, including the exact past-paper numbers).

### Errors found in your notes (Part 1 topics)

| Location | Error | Correct |
|---|---|---|
| *Wireless Communication Problems*, Problem 2.7 (p. 62) | "125 × 10⁻³ = (4 × 3.14 × d/0.3529)²" | Path loss = **125 × 10³**; final answer 9.93 m is correct |
| Same file, Problem 2.3 | Pr = 0.01 µW | **8.1 × 10⁻⁹ W (0.0081 µW)** |
| Same file, Problem 2.5 | Lp = 2.46 × 10⁸ | **Lp = 2.47 × 10¹⁰** |
