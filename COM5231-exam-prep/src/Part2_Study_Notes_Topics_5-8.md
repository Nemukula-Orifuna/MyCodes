# Part 2 — Detailed Study Notes: Topics 5–8

**Topics in this part**
5. Multiple Access Techniques (FDMA, TDMA, CDMA, SDMA) and Cellular Generations
6. Spread Spectrum (FHSS, DSSS, CDMA anti-jamming)
7. OFDM, OFDMA and SC-FDMA
8. Error Detection and Correction (parity, Internet checksum, Hamming code, CRC)

**Source codes used in this part**

| Code | File |
|---|---|
| **[MA p]** | *Multiple access techniquesV2.pdf*, page p (scanned slides) |
| **[AT]** | *Fundamentals of Communications Access Technologies.pdf* (Frenzel article) |
| **[MX]** | *Multiplexing notes.pdf* |
| **[SS]** | *Spread spectrum.pdf* (Forouzan §6.2) |
| **[OF]** | *OFDM.pdf* (Beard & Stallings Ch. 8) |
| **[ED]** | *Error detection and correction_v2.docx* (worksheet) |
| **[WC-S n] / [WC-B §]** | *The Wireless Channel.pptx* / *Wireless Communication.pdf* |
| **[BT]** | Bluetooth PDF and slides |

---

# TOPIC 5 — MULTIPLE ACCESS TECHNIQUES

## 5.1 Introduction

*"Sharing the limited bandwidth efficiently among many users is one of the main objectives of multiple access schemes"* [MA p1].

Cellular systems divide a region into **cells**, and a mobile in each cell communicates with a **base station**. The main objective of cellular design is to **handle as many calls as possible (capacity) in a given bandwidth with reliability**. Success depends on the availability of **radio frequency spectrum**, a **finite natural resource** defined in terms of **bandwidth**. The technologies that let many users share a finite amount of spectrum simultaneously and efficiently are called **multiple access** [MA p2].

The choice of multiple access technology **can significantly enhance or lower the service quality** delivered to end users [MA p2].

**The four multiple access techniques** [MA p2]: **FDMA, TDMA, CDMA, SDMA**. The article [AT] adds **OFDMA** as a fifth, and mentions CSMA as "other methods".

**Multiplexing vs multiple access**: multiplexing creates channels in frequency, time or code (FDM, TDM, CDM) [MA p3]. **Access methods are multiplexing techniques that provide communication services to multiple users** in a single-bandwidth medium [AT].

**Highway analogy** [MA p3]: the medium is the **highway**, the users are **cars**, and interference is **accidents**. Separate lanes = SDMA or FDMA; cars taking turns on one lane = TDMA.

## 5.2 Key definitions

| Term | Definition | Source |
|---|---|---|
| **Multiple access** | Allowing many mobile users to share a finite amount of radio spectrum simultaneously and efficiently, to maximise call-handling capacity in a given bandwidth | [MA p2] |
| **FDMA** | Radio spectrum divided into several frequency bands separated by **guard bands**; each band is used by one user simultaneously with the others | [MA p3] |
| **Guard band** | Unused frequency slots that separate neighbouring channels to minimise adjacent channel interference (crosstalk) | [MA p4] |
| **TDMA** | Several users share the same frequency band by dividing time into **slots** periodically allocated to each user | [MA p5] |
| **CDMA** | Transmissions **occupy the entire bandwidth at the same time** without interference, separated by **unique codes** | [MA p7] |
| **Spread-spectrum signal** | A signal with an **extra modulation** that expands its bandwidth **beyond what the data modulation requires** | [MA p7] |
| **Chip rate** | The rate of a spreading code (instead of "bit rate") | [MA p8] |
| **Pseudorandom code sequence** | Unique code shared by the mobile and the base station, used to spread and despread a user's data | [MA p8] |
| **SDMA** | Uses the **spatial dimension**: the same bandwidth is shared simultaneously by users in **different geographical locations** or **different beam directions** | [MA p9] |

## 5.3 Frequency Division Multiple Access (FDMA) ★

### Principle [MA p3–4, MX, AT]
- The **simplest** scheme; used for multiple access in **analogue** transmission.
- The spectrum is **divided into several frequency bands separated by guard bands**. Each band can be used simultaneously.
- The bandwidth is divided into channels and distributed among users, each with a **finite portion of bandwidth for permanent use**.
- **Only one user per channel**, who can use the channel **100% of the time**. Only the **frequency dimension** defines channels.
- **Guard bands** between adjacent channels minimise **crosstalk**.
- Each FDMA channel has **two frequencies**: a **forward channel** (base → mobile) and a **reverse channel** (mobile → base).
- While a user is "in conversation", **no other user can access the same spectrum**.
- Additional points [MX]: compatible with **both digital and analog** signals; needs **highly efficient filters**; **no timing issues** (unlike TDMA); **not prone to the near-far problem** of CDMA (thanks to frequency filtering); its weakness is **crosstalk** between frequencies.

```
Power
  ▲   Ch1   Ch2   Ch3   Ch4
  │  ┌───┐ ┌───┐ ┌───┐ ┌───┐
  │  │   │ │   │ │   │ │   │     each user owns one band all the time
  │  │   │g│   │g│   │g│   │     g = guard band
  └──┴───┴─┴───┴─┴───┴─┴───┴──► Frequency
```

### Number of channels ★ [MA p4]
```
N = (Bt − 2Bg) / Bc
```
- **Bt** = allocated frequency spectrum (total bandwidth)
- **Bg** = guard band allocated **at the edge** of the spectrum
- **Bc** = channel bandwidth

#### Worked example FD1 SUPPLEMENTARY (standard textbook numbers, using the lecturer's formula)
*A US AMPS-type system is allocated Bt = 12.5 MHz per direction, with Bg = 10 kHz at each edge and Bc = 30 kHz. How many channels?*
1. Formula: N = (Bt − 2Bg)/Bc
2. Substitute in kHz: N = (12 500 − 2 × 10)/30 = 12 480/30
3. **N = 416 channels**

#### Worked example FD2 SUPPLEMENTARY
*Bt = 5 MHz, Bg = 25 kHz, Bc = 200 kHz.* N = (5000 − 50)/200 = 24.75 → **24 channels** (always round **down**: a partial channel can't be used).

### Advantages of FDMA [MA p4]
1. **Continuous transmission**, so lower complexity than TDMA; synchronisation requirements are not severe.
2. **Simple hardware**: users are isolated with simple **band-pass filters**.
3. Fairly efficient with a **small user population** and **constant traffic**.
4. **No channel equalization** required.
5. Capacity can be increased by **reducing the information bit rate** and using efficient digital speech coding.

### Disadvantages of FDMA [MA p4]
1. An idle channel **sits idle** and cannot be used by others → **inefficient use of spectrum**.
2. Needs **tight RF filtering** to minimise adjacent channel interference.
3. **Network and spectrum planning are intensive**.
4. **Frequency planning is time-consuming**.
5. **Guard bands waste bandwidth**; bandwidth is also wasted when transmission isn't continuous.

### Applications [MA p4, AT]
- **Walkie-talkies** and mobile networks for **closed user groups**.
- **AM/FM radio broadcasting** (each station has its own channel).
- **Early cellular (1G)**, analogue.
- **Cable TV** (coax 4 MHz–1 GHz divided into 6 MHz channels) [AT].
- Fibre optics: **WDM/WDMA** (wavelength division) [AT].
- The old analog telephone hierarchy: 12 voice channels on subcarriers from 60–108 kHz (SSB) [AT].

## 5.4 Time Division Multiple Access (TDMA) ★

### Principle [MA p5–6, MX, AT]
- Digital systems don't need continuous transmission because users don't use their bandwidth all the time.
- Several users share the **same frequency band** by **dividing time into slots** allocated periodically to each user for the duration of a call.
- Possible because TDMA systems **transfer digital data**.
- **Different users can use the same frequency in the same cell, at different times.**
- 2G TDMA systems: **GSM, IS-136, PDC, DECT**.
- The US cellular TDMA standard divides a channel into **six slots, each signal using two**, so **three users per channel**, a **3:1 capacity gain over AMPS**.
- **Registration**: when the user presses push-to-talk (PTT), a control channel registers the radio with the nearest base station, which assigns **a pair of channels** (transmit/receive) **and a time slot**. The user can **only send/receive in its slot**.
- **Information flow is not continuous**: it is sent in **bursts**, re-assembled at the receiver fast enough to sound continuous.
- Analogue calls are **sampled** into digital format and placed into the assigned slot.
- Users need **synchronisation via a global clock** [MX].

**Two types** [MX]:
- **Fixed TDMA**: slots are statically assigned to data streams, changed only for large traffic variations. Slot size = **T/N** (T = frame time, N = users).
- **Dynamic TDMA**: a **scheduling algorithm** reserves a **variable number of slots** per frame according to traffic demand.

```
Frequency
  ▲  ┌──┬──┬──┐┌──┬──┬──┐
 f1  │U1│U2│U3││U1│U2│U3│ ...     one frequency, users take turns
     └──┴──┴──┘└──┴──┴──┘
        frame 1    frame 2       ──► Time
```

### Number of users ★ [MA p6]
```
Users supported = Number of channels in the spectrum × Time slots per channel
```
Example in the notes' figure: **4 channels × 3 slots = 12 users**.

#### Worked example TD1 SUPPLEMENTARY (GSM numbers from [AT])
*GSM uses 200 kHz channels with 8 slots each. With 25 MHz (one direction) and no guard bands, how many users?*
1. Channels = 25 000/200 = **125**
2. Users = 125 × 8 = **1000 simultaneous users**
*(With one channel reserved as a guard band, as in real GSM: 124 × 8 = 992.)*

#### Worked example TD2: combining FDMA and TDMA SUPPLEMENTARY
*Bt = 12.5 MHz, Bg = 10 kHz, Bc = 30 kHz, 3 slots/channel (IS-136).*
N = 416 channels (FD1) → users = 416 × 3 = **1248**.

### The T1 and GSM examples [AT]
- **T1**: 24 voice calls; each voice signal (300–3000 Hz) is sampled at **8 kHz** (just above the Nyquist rate) × 8 bits = **64 kbps**. 24 bytes + 1 framing bit = **193 bits per frame**, giving **1.544 Mbps**.
- **GSM**: 200 kHz channels, **8 users per channel**, frame sent at **270 kbps** using **GMSK** (a form of FSK); one frame = 1248 bits.

### Advantages of TDMA [MA p7]
1. Data are transmitted in **discrete bursts**, giving:
   - **extended battery life** and talk time compared to FDMA;
   - a **simpler handoff**: the phone can listen to other base stations during idle slots.
2. **More efficient use of spectrum** than FDMA:
   - **accommodates more users** in the same spectrum (capacity in high-traffic metropolitan areas);
   - efficient use of **hierarchical cell structures** (pico, micro, macro).
3. Different slots are used for transmit and receive, so **duplexers are not required**.

### Disadvantages of TDMA [MA p7]
1. **Requires synchronisation**: if slot sync is lost, channels may collide.
2. On the uplink, handsets need **high peak power** in transmit mode, which shortens battery life. With n channels the transmit power is **10 log n** dB higher than FDMA.
3. Network and spectrum planning are intensive.
4. **Dropped calls** are possible when users move between cells.
5. **Higher costs** from equipment sophistication.
6. **Equalization is required**, because transmission rates are much higher than in FDMA channels.

## 5.5 Code Division Multiple Access (CDMA) ★★

### Principle [MA p7–8, MX, AT]
- CDMA allows transmissions to **occupy the entire bandwidth at the same time without interference**.
- Based on **spread spectrum**: an extra modulation expands the bandwidth well beyond what the data need.
- The dominant spread-spectrum methods are **direct-sequence (DSSS)** and **frequency hopping (FHSS)**.
- **Spread spectrum is useful for** [MA p7]:
  1. **Suppressing interference**
  2. **Making interception difficult**
  3. **Accommodating fading and multipath channels**
  4. **Providing a multiple-access capability**
- History: originally **IS-95**, competing with GSM; operates in **800 MHz and 1.9 GHz PCS** bands; developed by **Qualcomm**. Compared to GSM, it needs **fewer towers** and gives **up to 5× the calling capacity**; **>10× the voice traffic of AMPS**; the basis for **3G** [MA p7].
- **Military origin**: first used in **WWII** by the English allies **to foil German attempts at jamming** [MX].

**How it works** [MA p8]:
1. Each user gets a **unique code sequence** (a **pseudorandom code**) used to code data before transmission; the code is shared by the mobile and the base station.
2. The baseband data are **spread** with this code, which runs at a **much higher rate** (the **chip rate**) than the data.
3. **All users access the entire spectrum all of the time.** The **unique code separates each call** from all others.
4. The transmitted signal sits **below the noise level**.
5. The receiver uses a **correlator** to **despread the wanted signal**, which then passes through a **narrowband filter**.
6. **Unwanted signals are not despread**, so they do not pass the filter; they stay as low-level noise.
7. **Power control**: phones and base stations use the **minimum power** needed, with precise power control to reduce users' power. This also gives **battery life, talk time and smaller batteries** [MA p8].

[AT] adds: data are **XORed with a chipping signal**. IS-95 uses a **1.2288 Mchip/s** chipping signal to spread **13 kbps** voice over **1.25 MHz**. **64 codes = 64 users** in one 1.25 MHz channel. **WCDMA** (3G) uses **3.84 Mchip/s** in **5 MHz**. In [MX], each subscriber is assigned an **orthogonal code called a "chip"**.

```
           Code
            ▲   ┌──────────────┐ user N
            │   ├──────────────┤ ...
            │   ├──────────────┤ user 2
            │   ├──────────────┤ user 1
            │   └──────────────┘
            └──────────────────────► Frequency  (all users: whole band, all the time)
           ╱
       Time
```

### Advantages of CDMA [MA p8]
1. **Greatest spectrum efficiency**: capacity about **8–10× analogue** and **4–5× other digital systems**; best in high-traffic areas with limited spectrum.
2. **Improves call quality** by filtering out background noise, crosstalk and interference.
3. **Soft handoffs**: because of multiple diversities, handoffs between cells are **undetected by the user**.
4. **Simplified frequency planning**: all users use the **same frequency spectrum**, so no detailed frequency plans, no re-tunes for expansion, and **fewer cells** for coverage.
5. **Random Walsh codes enhance user privacy**.
6. **Precise power control** increases talk time and battery life.

### Disadvantages of CDMA [MA p9]
1. **Backwards-compatibility** techniques are costly.
2. Equipment is **expensive**.
3. **Difficult to optimise** for maximum performance.
4. **Low-traffic areas** make inefficient use of spectrum and equipment.
5. (From the comparison table) **complex receivers**; needs **complicated power control** for senders [MA p10].

### Worked example: how CDMA codes separate users SUPPLEMENTARY (illustration of the principle in [MA p8])
Use bipolar values: bit 1 → +1, bit 0 → −1. Two users get **orthogonal (Walsh) codes**:
- User A code: **[+1 +1 +1 +1]**
- User B code: **[+1 −1 +1 −1]**
- Orthogonality check: A·B = (1)(1) + (1)(−1) + (1)(1) + (1)(−1) = **0** ✔

**Step 1: spread.** A sends bit **1** (+1) → +1 × A = [+1 +1 +1 +1]. B sends bit **0** (−1) → −1 × B = [−1 +1 −1 +1].
**Step 2: the channel adds them.** Received = [0 +2 0 +2].
**Step 3: despread for A.** Received · A = 0 + 2 + 0 + 2 = 4 → divide by 4 chips = **+1 → bit 1** ✔
**Step 4: despread for B.** Received · B = 0 − 2 + 0 − 2 = −4 → /4 = **−1 → bit 0** ✔

Each receiver recovers **only its own data**, even though both signals used the **same frequency at the same time**. A receiver without the right code sees only noise.

### Why is CDMA difficult to jam? ★ (Asked in: Exam Q1(d), T1A Q6, T1B Q7)
From the notes:
1. **The signal is spread over a very wide bandwidth** with low power density, **below the noise level** [MA p8]. A narrowband jammer only hits a small part of the band.
2. **Despreading spreads the jammer**: the receiver's correlator multiplies the received signal by the user's code. The wanted signal collapses back to narrowband, while the **jammer (not coded with the user's code) is spread out** and mostly removed by the **narrowband filter** [MA p8].
3. **Pseudorandom code is unknown to the jammer**: without knowing the code (or the hop sequence in FH), a jammer cannot concentrate energy where the signal is. In FHSS, *"a malicious sender may be able to send noise to jam the signal for one hopping period (randomly), but not for the whole period"* [SS].
4. **Designed for this purpose**: spread spectrum's stated uses include **suppressing interference** and **making interception difficult** [MA p7]. It was used in **WWII to foil German jamming** [MX]; Forouzan describes SS as wrapping the message in a "protective envelope" against **jamming from a malicious intruder** [SS].

SUPPLEMENTARY: this resistance is measured by the **processing gain** Gp = Bss/B (= chip rate / bit rate). E.g. IS-95: 1.2288 Mchip/s ÷ 9.6 kbps = 128, i.e. **≈ 21 dB**. A jammer is suppressed by roughly this factor.

## 5.6 Space Division Multiple Access (SDMA) ★

### Principle [MA p9–10, MX, AT]
- Besides frequency, time and code, the **spatial dimension** can separate users: data streams are sent over **different, non-overlapping spatial channels**.
- **SDMA lets users share the same bandwidth simultaneously in different geographical locations.**
- It solves the capacity problem by **exploiting the spatial dimension**: users can be identified **even when they share the same time/frequency/code**.
- Achieved by **beamforming** or **sectorization**.
- **Primitive form**: the **same frequency reused in different cells** (frequency reuse) [MX, AT]. **Sectorized antennas** (three 120° sectors per site) are a primitive form of SDMA [MA p10, AT].
- **Advanced form**: **smart antennas / adaptive arrays** with **dynamic beamforming**, focusing narrow beams on specific users and excluding others [AT]; **spot beams** [MX].
- Areas covered by different beams can use the **same frequency (TDMA or CDMA)** or **different frequencies (FDMA)** [MA p10, MX].
- In practice more than one transmitter may fall inside a beam, so **SDMA is combined with other multiple access techniques** [MX].

**Why SDMA was developed: omnidirectional vs adaptive antennas** [MA p9–10]
| Omnidirectional (traditional) | Adaptive antenna / SDMA |
|---|---|
| Base station has **no information on the mobile's position**; radiates in **all directions** | Uses **adaptive antenna arrays (smart antennas)** to send/receive **only within a limited angular range**, following the directional nature of multipath |
| **Wastes power** where there are no mobiles; causes **interference to co-channel cells** | Improves coverage/link quality when **noise-limited**; **enhances capacity** when **interference-limited** |
| Receives noise and interference from all directions | A BS with a **P-element antenna array** serves several single-antenna mobiles at once |

**Polarization division (PDMA)** [AT]: a variant of SDMA. Two signals on the same frequency use **vertical and horizontal polarization**; the antennas don't respond to the opposite polarization. Widely used in **satellites**.

### Advantages of SDMA [MA p10]
1. **Range extension**: fewer cells needed to cover an area.
2. **Interference suppression**: interference from other systems and cells is greatly reduced by exploiting each user's **unique channel impulse response**.
3. **Multipath effect elimination**: multipath copies can be mitigated, or even used to **reinforce** the signal.
4. **Capacity increase**, in two ways:
   - **tighter reuse patterns** (e.g. moving from a **7-cell to a 4-cell pattern nearly doubles capacity**);
   - **intracell reuse**: separate spatial channels on the **same conventional channel within one cell**.
5. **Compatibility** with most existing modulation schemes, carrier frequencies and specifications.

## 5.7 OFDMA (from the access article) [AT]
- Used in **LTE**. OFDM divides a channel into many narrow **orthogonal** subcarriers (**15 kHz** each) that don't interfere.
- Data are divided into many **lower-speed streams** modulated onto the subcarriers.
- **Each user is assigned a group of subcarriers and time slots.** The smallest group is **12 subcarriers = one resource block (RB)**.
- Very **spectrally efficient** and **less affected by multipath**. (Full detail in Topic 7.)

## 5.8 Other methods: CSMA [AT]
- **CSMA/CD**: the classical **Ethernet** method. Listen first, transmit if idle; if a collision occurs it is **detected**, and nodes wait a **random time** before retrying.
- **CSMA/CA**: similar, but a scheduling algorithm determines when to transmit. **CSMA/CD is used in wired networks; CSMA/CA is preferred in wireless.** (Full detail in Topic 9.)

## 5.9 ★ Comparison table [MA p10]

| | **SDMA** | **TDMA** | **FDMA** | **CDMA** |
|---|---|---|---|---|
| **Idea** | Segment **space** into cells/sectors | Segment **sending time** into disjoint slots, demand-driven or fixed | Segment the **frequency band** into disjoint sub-bands | **Spread the spectrum** using orthogonal codes |
| **Terminals** | Only one terminal active in one cell/sector | All terminals active for short periods on the same frequency | Every terminal has its **own frequency**, uninterrupted | **All terminals active at the same place at the same moment**, uninterrupted |
| **Signal separation** | Cell structure, directed antennas | **Synchronization in the time domain** | **Filtering in the frequency domain** | **Code plus special receivers** |
| **Advantages** | Very simple; increases capacity per km² | Established, fully digital, very flexible | Simple, established, robust | Flexible, less planning needed, **soft handover** |
| **Disadvantages** | Inflexible; antennas typically fixed | **Guard space** needed (multipath); synchronization difficult | Inflexible; frequencies are a scarce resource | **Complex receivers**; needs complicated **power control** |
| **Comment** | Only useful combined with TDMA, FDMA or CDMA | Standard in fixed networks; with FDMA/SDMA in many mobile networks | Typically combined with TDMA (frequency hopping) and SDMA (frequency reuse) | Used in many 3G systems; higher complexity; integrated with TDMA/FDMA |

## 5.10 Principles of cellular networks [MX, MA p2]
- Cellular technology is the basis of mobile wireless communication. It supports users where wired networks are hard to provide.
- It was developed to **increase capacity** for mobile radio telephone service, **replacing high-power transmitter/receiver systems**.
- It uses **lower power, shorter range and more transmitters**.
- The area is divided into **cells**, each served by a **base station** (network tower).
- The aim: **increase channel capacity**, i.e. handle as many calls as possible in a given bandwidth with sufficient quality of service.

## 5.11 Cellular network generations [MA p11–16]

| Generation | Key description [MA p11] |
|---|---|
| **0G** | Briefcase-size mobile radio telephones |
| **1G** | **Analog** cellular telephony |
| **2G** | **Digital** cellular telephony |
| **3G** | High-speed digital cellular telephony (including **video telephony**) |
| **4G (LTE)** | **IP-based** "anytime, anywhere" voice, data and multimedia at faster rates than 3G |

**Technologies per generation** [MA p11]: 1G: **AMPS, NMT, TACS**. 2G: **D-AMPS, GSM/GPRS, cdmaOne**. 3G: **CDMA2000/EV-DO, WCDMA/HSPA+, TD-SCDMA**. 4G: **LTE, LTE-Advanced**.
**Services**: 1G analog voice; 2G digital voice + simple data (<0.5 Mbps); 3G mobile broadband (63+ Mbps); 4G faster and better (300+ Mbps; richer content, more connections) [MA p11].
**Evolution summary** [MA p12]: 1G established **seamless mobile voice**; 2G **increased voice capacity** ("mobile to the masses"); 3G **optimised mobile for data** (mobile broadband); 4G LTE delivers **more capacity** for faster broadband.

### Details per generation [MA p13–15]

**1G**: circuit-switched; **FDMA**; analog; basic mobility; **poor voice quality**; **poor security**. Frequency **150 / 900 MHz**; analog bandwidth (**30 kHz**); data rate **2 kbps**; **1980–1990**; poor battery, big phones; "better than nothing".

**2G**: frequency **1.8 GHz (900 MHz)**; bandwidth 900 MHz (25 MHz); **digital**; **GSM**; **64 kbps**; **1991–2000**; **text messaging**; the signal must be strong or the digital signal is weak.
**2.5G**: 2G with **GPRS**: e-mail, web browsing, camera phones.

**3G**: frequency **1.6–2.0 GHz**; bandwidth **100 MHz**; digital broadband with increased speed; **CDMA, UMTS, EDGE**; **144 kbps – 2 Mbps**; **2000–2010**; smartphones, **video calls**, mobile TV; phones expensive.

**4G**: frequency **2–8 GHz**; bandwidth 100 MHz; high speed, **all-IP**; **LTE, WiFi**; **100 Mbps – 1 Gbps**; **2010–(2020)**; **MAGIC** = **M**obile multimedia, **A**nytime anywhere, **G**lobal mobile support, **I**ntegrated wireless solutions, **C**ustomized personal service; good QoS + high security; **bigger battery usage**.

**5G**: **2020–2030**; capacity **1 Gbps – "unlimited"**; high speed and capacity; faster than 4G; supports interactive multimedia, voice streaming; more efficient; frequency **3–300 GHz**; **1000× bandwidth per unit area**; technology **WWWW** (World Wide Wireless Web).

### Comparison table [MA p16]
| | **1G** | **2G** | **3G** | **4G** | **5G** |
|---|---|---|---|---|---|
| Deployment | 1970–80 | 1990–2004 | 2004–10 | Now | Soon (≈2020) |
| Data bandwidth | 2 kbps | 64 kbps | 2 Mbps | 1 Gbps | > 1 Gbps |
| Technology | Analog | Digital | CDMA 2000, UMTS, EDGE | Wi-Max, Wi-Fi, LTE | WWWW |
| Core network | PSTN | PSTN | Packet network | Internet | Internet |
| **Multiplexing** | **FDMA** | **TDMA/CDMA** | **CDMA** | **CDMA** | **CDMA** |
| Switching | Circuit | Circuit, packet | Packet | All packet | All packet |
| Primary service | Analog phone calls | Digital calls + messaging | Calls, messaging, data | All-IP service (incl. voice) | High speed, high capacity, Gbps broadcasting |
| Key differentiator | Mobility | Secure, mass adoption | Better Internet experience | Faster broadband, lower latency | Better coverage, no dropped calls, much lower latency |
| Weakness | Poor spectral efficiency, major security issue | Limited data rates; hard to support Internet/e-mail | Real performance fails to match hype; failure of WAP | More battery use; complicated, expensive hardware | ? |

> **NOTES ERROR**: the multiplexing row lists **CDMA for 4G and 5G**. That is inaccurate. **4G LTE uses OFDMA** (downlink) and **SC-FDMA** (uplink), as your own OFDM notes state [OF §8.2–8.3] and the article confirms [AT]. **5G NR also uses OFDM-based access.** If asked about 4G multiple access, answer **OFDMA**. Also note that the two "period" tables in your notes disagree (1G "1980–1990" vs "1970–80"). Quote the period with "approximately".

## 5.12 Examination focus — Topic 5
- Define multiple access; list the four techniques.
- FDMA/TDMA/CDMA/SDMA: principle, advantages, disadvantages, applications (4–10 marks each).
- **Describe CDMA and explain why it is difficult to jam** (4–10 marks; asked **3 times**).
- Compare FDMA, TDMA, CDMA and SDMA (the comparison table).
- Calculations: FDMA channels N = (Bt − 2Bg)/Bc; TDMA users = channels × slots.
- 1G–5G comparison; MAGIC.

## 5.13 Topic 5 revision summary
- **FDMA**: frequency bands + guard bands; one user per channel, 100% of the time; simple filters; wastes idle channels and guard bands. **N = (Bt − 2Bg)/Bc.**
- **TDMA**: one frequency, time slots, bursts; needs **sync** and **equalization**; better spectrum use, battery life, simple handoff; no duplexer. **Users = channels × slots.**
- **CDMA**: whole band, all the time, **unique pseudorandom codes**, chip rate ≫ bit rate, correlator despreads; **power control**; soft handoff; 4–5× capacity of other digital systems; **hard to jam/intercept**.
- **SDMA**: space; beamforming, sectorization, frequency reuse; range extension, interference suppression, capacity.
- Generations: 1G analog FDMA → 2G digital GSM TDMA → 3G CDMA/UMTS → 4G all-IP LTE (OFDMA) → 5G.

---

# TOPIC 6 — SPREAD SPECTRUM

## 6.1 Introduction
**Multiplexing** combines signals to achieve **bandwidth efficiency**. **Spread spectrum** also combines signals into a larger bandwidth, but with **different goals**: in wireless, all stations share the air, so they must share the medium **without interception by an eavesdropper** and **without being jammed by a malicious intruder** (e.g. military) [SS].

To achieve this, spread spectrum **adds redundancy**: the bandwidth B each station needs is **expanded to Bss, where Bss ≫ B**. Forouzan's analogy: like putting a delicate, expensive gift in a **protective box** and using a superior delivery service [SS].

## 6.2 Two principles of spread spectrum ★ [SS]
1. The bandwidth allocated to each station must be **far larger than what is needed**. This allows **redundancy**.
2. The expansion from B to Bss must be done **by a process independent of the original signal**: the spreading happens **after** the source creates the signal, using a **spreading code** (a series of numbers that **look random but are actually a pattern**).

```
 original          spreading          spread
 signal  B   ──►   process    ──►     signal  Bss  (Bss >> B)
                      ▲
               spreading code
```

**Two techniques**: **FHSS** and **DSSS** [SS].

Wireless benefits (also from [WC-B 5.4]): spread spectrum uses **100× or more bandwidth** with **lower energy density** per frequency. Even if some frequencies are poor (frequency-selective fading), average performance is good. It is a form of **frequency diversity** [WC-S 48].

## 6.3 Frequency Hopping Spread Spectrum (FHSS) ★

### How it works [SS Fig 6.28]
- Uses **M different carrier frequencies** modulated by the source signal. At any moment the signal modulates **one** carrier; at the next moment, **another**. Over time all M are used, so **B_FHSS ≫ B**.
- Components:
  1. A **pseudorandom code generator (PN)** creates a **k-bit pattern every hopping period Th**.
  2. A **frequency table** maps the pattern to a frequency.
  3. A **frequency synthesizer** creates that carrier.
  4. The **modulator**: the source signal modulates the carrier.

```
original ──► [Modulator] ──► spread signal
                  ▲
        [Frequency synthesizer]
                  ▲
          [Frequency table] ◄── [Pseudorandom code generator] (k bits / hop)
```

### The notes' worked example [SS Fig 6.29–6.30]
- **M = 8** hopping frequencies, so **k = 3** bits (2³ = 8). The original signal needs **100 kHz**.
- Frequency table: 000→200 kHz, 001→300, 010→400, 011→500, 100→600, **101→700**, 110→800, **111→900 kHz**.
- PN pattern: **101, 111, 001, 000, 010, 110, 011, 100**, then it **repeats after 8 hops**.
- Hop 1: 101 → **700 kHz**; hop 2: 111 → **900 kHz**; …; hop 8: 100 → **600 kHz**; then back to 101.

| Hop | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Pattern | 101 | 111 | 001 | 000 | 010 | 110 | 011 | 100 |
| Carrier (kHz) | 700 | 900 | 300 | 200 | 400 | 800 | 500 | 600 |

> **NOTES ERROR (minor)**: the text in [SS] lists the pattern as "101, 111, 001, 000, 010, 011, 100" (only 7 patterns, missing **110**). The figure shows all eight: 101 111 001 000 010 **110** 011 100. Use the eight-pattern version.

### Why FHSS achieves the goals [SS]
- **Privacy**: with many k-bit patterns and a short hopping period, an intruder can only catch a **small piece** of data, because they don't know the sequence and can't follow the hops.
- **Anti-jamming**: a jammer may jam **one hopping period** (randomly), **not the whole transmission**.

### Bandwidth sharing [SS Fig 6.31]
- With **M hopping frequencies**, **M channels can be multiplexed** into the same Bss: each station uses one frequency per hop, leaving M − 1 for M − 1 other stations (with a suitable modulation such as MFSK).
- **FHSS vs FDM**: in **FDM** each station uses **1/M of the band, fixed**. In **FHSS** each station also uses 1/M, but **the allocation changes from hop to hop**.

### FHSS in the module's technologies
- **IEEE 802.11 FHSS**: 2.4 GHz ISM; 2- or 4-level FSK; 1 or 2 Mbps; band divided into **79 sub-bands of 1 MHz**; a pseudorandom generator selects the hop sequence [WLAN slides 23–24].
- **Bluetooth**: **79 × 1 MHz channels**, **1600 hops/s** (slot 0.625 ms); piconet access **FH-TDD-TDMA**; scatternet access **FH-CDMA** [BT].

## 6.4 Direct Sequence Spread Spectrum (DSSS) ★

### How it works [SS Fig 6.32]
- Also expands bandwidth, but differently: **each data bit is replaced by n bits (chips)** using a spreading code. The **chip rate is n times the data bit rate**.
- A **chips generator** feeds a **modulator** together with the original signal.

### The notes' example: the Barker sequence [SS Fig 6.33]
- Used in **wireless LANs**: the **Barker sequence, n = 11**: **10110111000**.
- With polar NRZ, **spread signal = original × chips**: a data bit 1 sends the code as is; a data bit 0 sends the **inverted** code.
- If the original rate is N, the spread rate is **11N**, so the spread signal needs **11 times the bandwidth**.

**Worked example DS1: spreading data 1 0 1 with the Barker code**
| Data bit | Chips sent (11 chips per bit) |
|---|---|
| 1 | 1 0 1 1 0 1 1 1 0 0 0 (code as is) |
| 0 | 0 1 0 0 1 0 0 0 1 1 1 (code inverted) |
| 1 | 1 0 1 1 0 1 1 1 0 0 0 |

SUPPLEMENTARY: in binary (0/1) form, spreading = **data XOR chip** with the convention "data 1 ↔ chip unchanged". Using bipolar values (+1/−1) it is plain multiplication. At the receiver, multiplying by the same code again recovers the data (correlation).

- **Benefits**: **privacy** if the intruder doesn't know the code; **immunity against interference** if each station uses a different code [SS].
- **Bandwidth sharing in DSSS: "no and yes"** [SS]: if the code's spread signals **cannot be combined and separated**, the bandwidth **cannot** be shared (e.g. some WLANs using the Barker code). With **special codes that allow combining and separating** (orthogonal codes, i.e. **CDMA**), it **can** be shared.

### DSSS in the module's technologies
- **802.11 DSSS**: 2.4 GHz ISM; **BPSK/QPSK**; 1 or 2 Mbps. **802.11b HR-DSSS**: **5.5 and 11 Mbps** [WLAN slides 24–25].
- **CDMA (IS-95)**: 1.2288 Mchip/s, 1.25 MHz channel [AT].
- **802.15.4/ZigBee**: DSSS PHY at 868/915 MHz and 2.4 GHz [BT].

## 6.5 ★ FHSS vs DSSS comparison (assembled from [SS], [MA p7])

| | **FHSS** | **DSSS** |
|---|---|---|
| Spreading method | Carrier **hops** among M frequencies in a pseudorandom sequence | Each bit is replaced by **n chips** (code at n× the bit rate) |
| Bandwidth at any instant | **Narrow** (one channel) | **Wide** (whole spread band all the time) |
| Code determines | **Which frequency** to use in each hop period | **The chip pattern** that multiplies each bit |
| Key components | PN generator, frequency table, frequency synthesizer, modulator | Chip generator, modulator (XOR/multiply) |
| Effect of narrowband interference/jamming | Only the hops that land on the jammed frequency are hit | The receiver's despreading **spreads the jammer**, which is filtered out |
| Sharing | M stations can share Bss (like time-varying FDM) | Shareable only with orthogonal codes (CDMA) |
| Examples | 802.11 FHSS, **Bluetooth** | 802.11 DSSS/b, **IS-95 CDMA**, WCDMA, 802.15.4 |

**FH-CDMA vs DS-CDMA** (Bluetooth exercise 15): in **FH-CDMA**, users are separated because they follow **different hopping sequences**; they occasionally collide on the same frequency (e.g. Bluetooth piconets in a scatternet [BT]). In **DS-CDMA**, users transmit **at the same time over the same wide band**, separated by **different (orthogonal/pseudorandom) chip codes** and correlation at the receiver (e.g. IS-95) [MA p7–8, AT].

## 6.6 Examination focus — Topic 6
- **Explain the spread spectrum principles of (i) FHSS and (ii) DSSS** (asked in **Exam Q1(b), T1A Q4, T1B Q6**; 4–10 marks).
- **Describe CDMA and why it is difficult to jam** (3 times).
- Spread spectrum vs multiplexing; two principles of SS; the Barker code; the FHSS example table; FH-CDMA vs DS-CDMA.

## 6.7 Topic 6 revision summary
- SS goals: **privacy and anti-jamming**, not bandwidth efficiency. **Bss ≫ B**, added **redundancy**; spreading is **independent of the signal**, using a **pseudorandom code**.
- **FHSS**: PN generator → frequency table → synthesizer → modulator; hops every Th; M frequencies, k = log₂M bits. Jammer hits only some hops.
- **DSSS**: each bit → n chips; chip rate = n × bit rate; **Barker 11 chips = 10110111000**; bandwidth × n.
- **CDMA** = DS spread spectrum with orthogonal codes, so many users share the band.

---

# TOPIC 7 — OFDM, OFDMA AND SC-FDMA

## 7.1 Introduction
**OFDM** has *"created great expansion in the capacity of wireless networks"*. It is the main air-interface technology used to move from **3G to 4G**, allows the expansion of **IEEE 802.11** data rates, and is critical to **WiMAX** broadband [OF]. Together with **MIMO**, OFDM is the **cornerstone of broadband wireless** [WC-B 5.4].

**Learning objectives** [OF]: overview of OFDM, OFDMA and SC-FDMA; how OFDM **combats frequency-selective fading**; the value of **orthogonal carriers**; the reduction in oscillators using the **IFFT**; problems of **PAPR**; how multiple access is achieved using OFDM and SC-FDMA.

## 7.2 Key definitions

| Term | Definition | Source |
|---|---|---|
| **OFDM** (multicarrier modulation) | Uses **multiple carrier signals at different frequencies**, sending some of the bits on each. Similar to FDM, **but many subcarriers are dedicated to a single data source** | [OF §8.1] |
| **Orthogonality** | Two signals s₁(t), s₂(t) are orthogonal if the **average over a bit time of s₁(t)·s₂(t) = 0** | [OF §8.1] |
| **OFDMA** | Combination of **FDMA and TDMA**: different users use **subsets of the subcarriers** at **different times** | [OF §8.2] |
| **Subchannel** | A **group of subcarriers** (scheduling individual subcarriers is not feasible or sufficient); called a **Resource Block** in LTE | [OF §8.2] |
| **SC-FDMA** | Single-carrier FDMA: similar structure and performance to OFDMA, but with **lower PAPR**; performs an extra **DFT** before the IFFT | [OF §8.3] |

## 7.3 How OFDM works ★ [OF §8.1, Fig 8.1]
- A binary stream at **R bps**, with available bandwidth **N·fb** centred on f₀.
- **Option 1**: use the whole bandwidth for one stream, so each bit lasts **1/R**.
- **OFDM**: a **serial-to-parallel converter** splits the stream into **N substreams**, each at **R/N bps**, each on its own **subcarrier**, spaced **fb** apart. Now each bit lasts **N/R**, which is **much longer**. This gives special capabilities to **overcome multipath fading**.

```
            ┌─► R/N bps ─► Modulator @ f0 + (N−1)fb/2
            ├─► R/N bps ─► Modulator @ f0 + 3fb/2
R bps ─►[Serial-to-   ├─► R/N bps ─► Modulator @ f0 + fb/2      ──► Σ ──► OFDM signal
        parallel] ├─► R/N bps ─► Modulator @ f0 − fb/2
            ├─► ...
            └─► R/N bps ─► Modulator @ f0 − (N−1)fb/2
```

### Orthogonality ★ [OF §8.1, Fig 8.2]
- The **base frequency fb** is the lowest subcarrier; all others are **integer multiples**: 2fb, 3fb, …
- The spectra **overlap substantially**, but **the peak of each subcarrier's spectrum falls where every other subcarrier's power is zero**, so there is **no interference** between them.
- **Traditional FDM** spaces carriers apart to (1) avoid overlap and (2) add **guard bands**. In the notes' comparison (Fig 8.2b vs 8.2c, subcarriers at fb, 2fb, 3fb vs fb, 7fb, 13fb), **OFDM supports 6 times as many signals** in the same spectrum.

**Mathematical condition** [OF]:
```
Average over bit time of s₁(t)·s₂(t) = 0
```
At the transmitter s(t) = s₁(t) + s₂(t). To extract s₁, the receiver multiplies by s₁(t) and averages:
```
avg[s₁(t)·s(t)] = avg[s₁²(t)] + avg[s₁(t)·s₂(t)] = avg[s₁²(t)] + 0
```
Only s₁ remains; all other orthogonal signals are removed.

**Requirement for OFDM subcarriers**: if the subcarrier bit time is **T**, then **fb must be a multiple of 1/T**, and every other subcarrier is M·fb = M/T for an integer M [OF].
**Examples**: **LTE subcarrier spacing = 15 kHz**. **802.11n**: **48 subcarriers in 20 MHz** (108 in 40 MHz), **fb = 0.3125 MHz**, then translated to 2.4 or 5 GHz [OF].

### Benefits of OFDM ★ [OF §8.1]
1. **Frequency-selective fading only affects some subcarriers**, not the whole signal. With **FEC**, this is easily handled.
2. **Overcomes intersymbol interference (ISI)** (the most important benefit). The data rate per carrier drops by **N**, so the **symbol time grows by N**: from **Ts to N·Ts**. Choose N so that **N·Ts ≫ the RMS delay spread** of the channel, and multipath delays hardly matter.
3. As a result **equalizers may not be needed**. Equalizers are complex and expensive, and their complexity grows with ISI severity.
4. **Spectral efficiency**: orthogonal subcarriers pack tightly, with no guard bands between them (6× in the example).
5. [WLAN slide notes] **Degradations are easier to handle per subcarrier**: badly degraded subcarriers can be **excluded** in favour of good ones.

### Difficulties of OFDM SUPPLEMENTARY (pages 241–244 of [OF] are missing from your upload; the learning objectives name these topics)
1. **Peak-to-average power ratio (PAPR)**: adding many subcarriers occasionally produces **very high peaks**, so the transmitter's power amplifier must be **linear over a wide range**. This is expensive and **power-inefficient**, which is bad for battery-powered phones. This is why LTE uses **SC-FDMA on the uplink**.
2. **Intercarrier interference (ICI)**: orthogonality depends on exact spacing; **frequency offsets and Doppler** break it, so subcarriers leak into each other. Tight synchronisation is needed.
3. **IFFT implementation**: building N separate oscillators would be impractical. The **inverse fast Fourier transform (IFFT)** generates all subcarriers digitally at once (and the FFT at the receiver), which is why OFDM is practical. A **cyclic prefix** (copy of the end of each symbol placed at its start) acts as a guard interval against ISI [OF Fig 8.8 shows "Add CP"].

## 7.4 OFDMA ★ [OF §8.2]

### Principle
- Multiple access options: scheduled times (**TDMA**), random access (**CSMA**), scheduled frequencies (**FDMA**), coded spreading (**DSSS**), coded hopping (**FHSS**).
- **OFDMA = FDMA + TDMA**: users get **subsets of subcarriers at different times**.
- **Not all OFDM systems use OFDMA**: e.g. some 802.11 versions use OFDM for transmission but **CSMA** for access, and the transmitter uses **all** subcarriers when sending. **LTE uses OFDMA only on the downlink** and a **single-carrier approach (SC-FDMA) on the uplink**.
- Subcarriers are grouped into **subchannels**. In the **downlink**, subchannels may go to **different receivers**. In the **uplink**, a transmitter may be assigned one or more subchannels.
- **Uplink subchannelization saves transmit power**: the device concentrates its power on its own subchannels, which is useful for **battery-powered 4G devices**.

### ★ OFDM vs OFDMA (Asked in: T1B Q8, 10 marks; OF review Q 8.5)

| | **OFDM** | **OFDMA** |
|---|---|---|
| What it is | A **modulation / transmission technique** (multicarrier) | A **multiple access technique** built on OFDM |
| Users per symbol | **All subcarriers carry one user's data** at a time | Subcarriers are **divided among several users** at the same time |
| Sharing between users | Needs another method, e.g. **TDMA or CSMA** (802.11a/g) | Built in: **FDMA + TDMA** (subchannels × time slots) |
| Allocation unit | Whole channel | **Subchannel / resource block** (LTE: 12 subcarriers) |
| Scheduling | None per subcarrier | **Opportunistic scheduling** by channel quality |
| Power (uplink) | Device spreads power over all subcarriers | Device concentrates power on **its subchannels** |
| Examples | 802.11a/g/n | **LTE downlink**, WiMAX |

## 7.5 ★ The three subchannel allocation methods (Asked in: Exam Q1(c), T1A Q5; OF review Q 8.10)

| Method | Description | **Benefits** | Drawbacks | Used by |
|---|---|---|---|---|
| **(i) Adjacent subcarriers** | All subcarriers of a subchannel in a **contiguous block** | All **SINRs ≈ equal**. Gives an **opportunity**: the system can choose among many blocks the **best block for each user**, optimising **channel efficiency, user requirements, priority and fairness** (exploits frequency-selective fading for multi-user gain) | If those frequencies are poor, the whole subchannel suffers. Requires accurate knowledge of each user's channel over the **full bandwidth** → **pilot symbols**, prediction (information may already be **out of date**) | LTE, WiMAX |
| **(ii) Regularly spaced subcarriers** ("distributed" / "comb") | Subcarriers spread at **regular intervals** across the band | **Frequency diversity**: there are enough **good subcarriers regardless of which are chosen**; **channel estimation burden is much lower** | Can't exploit the single best block for a user | LTE |
| **(iii) Randomly spaced subcarriers** | Subcarriers chosen **randomly** across the band | **Same frequency-diversity benefits** as regularly spaced, **plus reduced adjacent-cell interference** (neighbouring cells' random patterns rarely collide fully) | | WiMAX |

## 7.6 Opportunistic scheduling [OF §8.2]
Subchannels (**Resource Blocks** in LTE) are allocated to subscriber stations by **channel conditions and data requirements**, possibly with prescribed power levels. Time-varying, multipath channels create **opportunities** that can be exploited. Most standards **don't prescribe** the scheduler (vendors compete). Considerations:
1. **Efficiency**: schedule users with the **highest SINR**; they use AMC for high throughput, which maximises total capacity.
2. **Fairness**: pure efficiency starves users far from the base station. **Proportional fairness**: each user computes **rᵢ / r̄ᵢ** (rate achievable now ÷ average rate obtained). Users are compared **against themselves**; those with a good opportunity **for them** get scheduled.
3. **Requirements**: delay and jitter for audio and video.
4. **Priority**: police, fire, ambulance and public-safety users in emergencies.

#### Worked example PF1 SUPPLEMENTARY (applying the notes' formula)
User 1: achievable now r₁ = 6 Mbps, average r̄₁ = 4 Mbps → metric **1.5**. User 2 (cell edge): r₂ = 2 Mbps, average r̄₂ = 1 Mbps → metric **2.0**. **User 2 is scheduled**, even though user 1's absolute rate is higher, because user 2 currently has an unusually good channel *for them*.

## 7.7 SC-FDMA [OF §8.3]
- Similar structure and performance to OFDMA. Its prominent advantage is a **lower PAPR**, which gives **battery life, power efficiency and lower cost** for mobiles.
- Not the same as basic OFDM: it adds an **extra DFT** at the transmitter and **frequency equalization** at the receiver.
- Used on the **uplink** (LTE); **OFDMA stays on the downlink** for greater multiple-access flexibility.
- **Chain** (Fig 8.8): bit stream → **N-point DFT** → subcarrier mapping → **Q-point IFFT** → add **CP** → channel → remove CP → FFT → de-mapping → **EQ** → **IDFT** → bits. (OFDMA omits the DFT/IDFT.)
- The DFT **spreads each data symbol over all subcarriers**, giving a **virtual single-carrier** structure. **Every data symbol is carried by every subcarrier.**
- **Multiple access**: in OFDMA, different users can share subcarriers **in the same interval**. In SC-FDMA, at any instant **all subcarriers carry the same stream, so they must belong to one user**; multiple access is only **over time**. A better name would be "SC-OFDM-TDMA".

## 7.8 Examination focus — Topic 7
- Benefits of the three OFDMA approaches (**Exam Q1(c) 6, T1A Q5 9**).
- Difference between OFDM and OFDMA (**T1B Q8 10**).
- Review questions [OF]: define OFDM, OFDMA, SC-FDMA; the **fundamental requirement of OFDM** (**orthogonality**: subcarrier spacing a multiple of 1/T); main strengths; main problems (**PAPR, ICI**); how orthogonality increases capacity (overlapping without interference, ~6×); the purpose of SC-FDMA (**lower PAPR on the uplink**).

## 7.9 Topic 7 revision summary
- OFDM: split R bps into **N streams of R/N** on **orthogonal subcarriers** (multiples of fb; spacing = 1/T). Symbol time N·Ts ≫ delay spread → **no ISI**, often no equalizer. Selective fading hits only a few subcarriers (FEC fixes them). Tight packing.
- LTE 15 kHz spacing; 802.11n 48 subcarriers/20 MHz, fb = 312.5 kHz.
- OFDMA = FDMA + TDMA over **subchannels/resource blocks**; LTE **downlink**. Allocation: **adjacent** (best-block selection, needs full CSI), **regular** (diversity, low estimation burden), **random** (diversity + less adjacent-cell interference).
- Scheduling: efficiency, **proportional fairness rᵢ/r̄ᵢ**, requirements, priority.
- SC-FDMA: extra DFT, **low PAPR**, LTE **uplink**; one user at a time.

---

# TOPIC 8 — ERROR DETECTION AND CORRECTION

## 8.1 Introduction
Wireless channels have high bit error rates (Topic 2). Receivers must at least **detect** errors (then use ARQ retransmission) or, better, **correct** them (FEC). The worksheet [ED] lists the four methods examined in this module: **parity checks, the Internet checksum, the Hamming code and the cyclic redundancy check (CRC)**. The calculation questions on these appear in **every** Test 1/Test 2/Exam paper.

> **Source note**: the worksheet [ED] contains web links and worked CRC examples, but **no written theory** for parity, checksum or Hamming. Theory below marked SUPPLEMENTARY follows the standard sources the worksheet links to (UNB ECE4253 pages; Kurose & Ross; Forouzan). The **error detection process** and FEC/ARQ come from your notes [WC-S 69–71; WC-B 5.4].

## 8.2 Key definitions

| Term | Definition | Source |
|---|---|---|
| **Error detection code** | Detects the **presence** of an error | [WC-S 69] |
| **ARQ (automatic repeat request)** | The block with an error is **discarded** and the transmitter **retransmits** it | [WC-S 69] |
| **Error correction code (FEC)** | Designed to **detect and correct** errors | [WC-S 69] |
| **Single-bit error** | **Only one bit** of the data unit (byte, frame, packet) is changed (1→0 or 0→1) | SUPPLEMENTARY (Forouzan) |
| **Burst error** | **Two or more bits** in the data unit have changed (not necessarily consecutive) | SUPPLEMENTARY (Forouzan) |
| **Burst length** | Measured **from the first corrupted bit to the last corrupted bit**, inclusive; bits in between may or may not be corrupted | SUPPLEMENTARY (Forouzan) |
| **Codeword** | Data bits plus the redundant (check) bits actually transmitted | SUPPLEMENTARY |
| **Modulo-2 arithmetic** | Binary addition/subtraction **without carries or borrows**, identical to **XOR** | SUPPLEMENTARY |

## 8.3 The error detection process [WC-S 70–71]
**Transmitter**: for a given frame, an error-detecting code (**check bits**) is calculated from the data bits and **appended** to them.
**Receiver**: separates the frame into data and check bits, **recalculates** the check bits from the received data, **compares** them with the received check bits. A **mismatch = detected error**.

```
Tx:  data ──► f(data) = E ──► send [data | E]
Rx:  receive [data' | E'] ──► compute f(data') = E'' ──► compare E'' with E'
                                                        equal → accept
                                                        differ → error detected (ARQ / discard)
```

## 8.4 ★ Single-bit errors vs burst errors (Asked in: T1B Q1 [10], T2-2026 Q5 [3])
SUPPLEMENTARY theory (standard Forouzan/Stallings definitions):

| | **Single-bit error** | **Burst error** |
|---|---|---|
| Definition | **Only 1 bit** in the data unit is changed | **2 or more bits** changed |
| Typical cause | Short, isolated noise; rare in serial transmission | **Impulse noise**, fading dips. A noise burst lasts longer than one bit, so it hits many bits. In wireless, **burst errors dominate** |
| Example | Sent 0000 0010 → received 0000 **1**010 | Sent 0100 0100 0100 0011 → received 0101 1101 0100 0011 (errors at positions 4, 5 and 8 → burst length 8 − 4 + 1 = 5) |
| Length | 1 bit | From the **first to the last corrupted bit** inclusive |

Your notes support the cause: **impulse noise is the primary source of error in digital data**. A 0.01 s spike wipes out **~10 000 bits at 1 Mbps**, which is a long burst [WC-B 5.2]. Fading in mobile channels causes 20–30 dB drops lasting many bits [WC-B 5.3].

**Measuring burst length (worked)**: sent 1011 0110, received 10**0**1 0**0**10. Errors at bit positions 3 and 6 (from the left). Burst length = 6 − 3 + 1 = **4 bits** (positions 4 and 5 are inside the burst but happen to be correct).

## 8.5 ★ Parity checking
SUPPLEMENTARY theory (standard; the worksheet's first link covers it).

**Single (even) parity**: append **one bit** so the total number of 1s (data + parity) is **even**. (Odd parity: make it odd.)
- Data 1011001 (four 1s) → even parity bit **0** → send 1011001**0**.
- Data 1011000 (three 1s) → even parity bit **1** → send 1011000**1**.
- **Receiver**: counts the 1s. Odd count → **error detected**.

### ★ What parity can and cannot do (Asked in: T1B Q1 [10], T2-2026 Q6 [5])
1. **Single-bit errors: always detected** ✔. One flip changes the count of 1s by one, so even becomes odd.
2. **Burst errors: NOT guaranteed.** Parity detects **any odd number** of flipped bits but **misses any even number** (2, 4, …), because two flips leave the count's parity unchanged.
   - Example: send 1011001**0** (four 1s). A burst flips bits 2 and 3 → 1**10**10010 still has four 1s → **passes the check** → undetected.
   - A burst flips 3 bits → odd count → detected. **About half of random bursts escape detection.**
3. **Correction: impossible** with one parity bit. The receiver knows *that* an odd number of bits changed, but **not which bit**; any of the n bits could be the culprit. Only ARQ (retransmission) can recover.

**Conclusion on appropriateness**: parity is **appropriate for single-bit errors** (cheap, 1 extra bit, always detects them) but **inappropriate for burst errors**, which are the common case in wireless/noisy channels. For bursts, use **CRC** (which detects all bursts of length ≤ r, where r = number of check bits) or **two-dimensional parity**.

**Two-dimensional parity** SUPPLEMENTARY: arrange data in rows and add a parity bit to **every row and every column**. It can **detect and correct any single-bit error** (the failing row and column intersect at the bad bit) and detects many burst errors, but some patterns of **4 errors in a rectangle** go undetected.

```
           data        row parity
         1 0 1 1   |   1
         0 1 1 0   |   0
         1 1 0 1   |   1
         ─────────────
col par  0 0 0 0   |   0
A single error at row 2, col 3 makes row 2 AND column 3 fail → bit located → flip it.
```

## 8.6 ★ The Internet checksum
SUPPLEMENTARY theory (standard RFC 1071 / Kurose method, at the 4-bit word size used in your questions).

**Sender**:
1. Divide the message into **k-bit words** (here k = 4).
2. Add all words using **one's-complement addition**: any **carry out of the top bit is wrapped around** and added to the result (**end-around carry**).
3. The **checksum = one's complement of the sum** (flip every bit).
4. Send the data words + the checksum.

**Receiver**: adds **all words including the checksum** with end-around carry. If there are no errors, the result is **all 1s (1111)**, and its complement is 0000. Anything else → error.

### ★ Worked example CK1 (Exam Q2(c), 2 marks; also the worksheet [ED])
*Message 1001 1100 1010 0011, Internet checksum with 4-bit words. Value of the checksum?*

| Step | Operation | Binary result | Carry? | After wrap |
|---|---|---|---|---|
| 1 | 1001 + 1100 | 1 0101 | carry 1 | 0101 + 1 = **0110** |
| 2 | 0110 + 1010 | 1 0000 | carry 1 | 0000 + 1 = **0001** |
| 3 | 0001 + 0011 | 0100 | none | **0100** |

- **Sum = 0100**
- **Checksum = one's complement of 0100 = 1011**

**Check (decimal)**: 9 + 12 + 10 + 3 = 34. One's-complement 4-bit sum: 34 = 2 × 15 + 4 → 4 = 0100 ✔ → complement **1011**.
**Receiver check**: 0100 (sum of data) + 1011 = **1111** ✔ (no error).

### ★ Worked example CK2 (T2-2026 Q4: (a) 3 marks, (b) 1 mark)
*Message 1010 1100 0110 1001, 4-bit words, one's-complement addition with end-around carry.*

| Step | Operation | Binary result | Carry? | After wrap |
|---|---|---|---|---|
| 1 | 1010 + 1100 | 1 0110 | carry 1 | 0110 + 1 = **0111** |
| 2 | 0111 + 0110 | 1101 | none | **1101** |
| 3 | 1101 + 1001 | 1 0110 | carry 1 | 0110 + 1 = **0111** |

- **Sum = 0111** → **Checksum = 1000**
- **Check (decimal)**: 10 + 12 + 6 + 9 = 37 = 2 × 15 + 7 → 0111 ✔.
- **(b)** The receiver adds all message words **and** the checksum: 0111 + 1000 = **1111**. So the expected result is **1111** (all ones; its complement is 0000).

## 8.7 ★ Hamming code
SUPPLEMENTARY theory (the worksheet links the UNB Hamming page; **this is the method T2-2026 Q2 specifies**).

**Purpose**: an **error-correcting code** (FEC) that can **detect and correct any single-bit error** by using several parity bits, each covering a different subset of positions. The pattern of failing checks **points to the bad bit**.

### Step 1: how many check bits? The Hamming inequality
For m data bits and r check bits:
```
2^r ≥ m + r + 1
```
Why: the r check bits can give 2^r different "syndromes". These must name every one of the **m + r positions** where a single error could be, **plus 1** for "no error".

For **m = 8**:
- r = 3: 2³ = 8 ≥ 8 + 3 + 1 = 12? **No** ✘
- r = 4: 2⁴ = 16 ≥ 8 + 4 + 1 = 13? **Yes** ✔
- **Minimum r = 4 check bits**, so the codeword has **12 bits**.

### Step 2: positions
- Number positions **1 to 12 from the left**.
- **Check bits go at positions that are powers of 2: 1, 2, 4, 8.**
- **Data bits fill the remaining positions 3, 5, 6, 7, 9, 10, 11, 12, left to right.**

### Step 3: which positions each check bit covers
Check bit P at position 2^k covers every position whose **binary number has that bit set**:

| Check bit | Covers positions (rule) | Data positions it checks |
|---|---|---|
| **P1** (pos 1) | binary xxx**1**: 1, 3, 5, 7, 9, 11 | **3, 5, 7, 9, 11** |
| **P2** (pos 2) | binary xx**1**x: 2, 3, 6, 7, 10, 11 | **3, 6, 7, 10, 11** |
| **P4** (pos 4) | binary x**1**xx: 4, 5, 6, 7, 12 | **5, 6, 7, 12** |
| **P8** (pos 8) | binary **1**xxx: 8, 9, 10, 11, 12 | **9, 10, 11, 12** |

**Even parity**: each check bit = XOR (sum mod 2) of the data bits it covers, so the group's total number of 1s is even.

### ★ Worked example HM1 (Exam Q2(a), 4 marks; also the worksheet [ED]): data 10101111
**Check bits needed**: m = 8 → **r = 4** (inequality above).

**Placement:**
| Position | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Type | P1 | P2 | D | P4 | D | D | D | P8 | D | D | D | D |
| Data bit | | | **1** | | **0** | **1** | **0** | | **1** | **1** | **1** | **1** |

**Check bits (even parity):**
- **P1** = bits at 3, 5, 7, 9, 11 = 1, 0, 0, 1, 1 → three 1s → **P1 = 1**
- **P2** = bits at 3, 6, 7, 10, 11 = 1, 1, 0, 1, 1 → four 1s → **P2 = 0**
- **P4** = bits at 5, 6, 7, 12 = 0, 1, 0, 1 → two 1s → **P4 = 0**
- **P8** = bits at 9, 10, 11, 12 = 1, 1, 1, 1 → four 1s → **P8 = 0**

**Codeword:**
| Position | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Bit | **1** | **0** | 1 | **0** | 0 | 1 | 0 | **0** | 1 | 1 | 1 | 1 |

**Transmitted codeword = 1010 0100 1111** (12 bits).

> SUPPLEMENTARY convention warning: some textbooks (e.g. Stallings' *Data and Computer Communications*) number positions **from the right** and place data in a different order, which gives a different-looking codeword. Exam Q2(a) does not state a convention, so **write your convention in one line** ("positions numbered 1–12 from the left; check bits at 1, 2, 4, 8; data bits in order in 3, 5, 6, 7, 9–12") and the marker can follow your working. T2-2026 Q2 specifies exactly this convention.

### ★ Worked example HM2 (T2-2026 Q2(a)–(c), 8 marks): data 11001010
**(a) Minimum check bits.** Inequality **2^r ≥ m + r + 1** with m = 8. r = 3: 8 ≥ 12 ✘. r = 4: 16 ≥ 13 ✔. **r = 4.** Verify: 2⁴ = 16 ≥ 13 ✔ while 2³ = 8 < 12.

**(b) Placement and check bits:**
| Position | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Type | P1 | P2 | D | P4 | D | D | D | P8 | D | D | D | D |
| Data bit | | | **1** | | **1** | **0** | **0** | | **1** | **0** | **1** | **0** |

- **P1** covers 1, 3, 5, 7, 9, 11 → data 1, 1, 0, 1, 1 = four 1s → **P1 = 0**
- **P2** covers 2, 3, 6, 7, 10, 11 → data 1, 0, 0, 0, 1 = two 1s → **P2 = 0**
- **P4** covers 4, 5, 6, 7, 12 → data 1, 0, 0, 0 = one 1 → **P4 = 1**
- **P8** covers 8, 9, 10, 11, 12 → data 1, 0, 1, 0 = two 1s → **P8 = 0**

**(c) Complete codeword (positions 1 → 12):**
| Position | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Bit | **0** | **0** | 1 | **1** | 1 | 0 | 0 | **0** | 1 | 0 | 1 | 0 |

**Transmitted codeword = 0011 1000 1010**

### How the receiver corrects an error (syndrome) SUPPLEMENTARY
Recompute each check over its group, including the received check bit. Write the failing checks as a binary number **C8 C4 C2 C1** (1 = fails). This number is the **position of the bad bit**; 0000 = no error.

*Example using HM2*: suppose bit 6 flips, so 0011 1**1**00 1010 is received.
- C1 (1, 3, 5, 7, 9, 11): 0, 1, 1, 0, 1, 1 = four 1s → OK → 0
- C2 (2, 3, 6, 7, 10, 11): 0, 1, **1**, 0, 0, 1 = three 1s → FAIL → 1
- C4 (4, 5, 6, 7, 12): 1, 1, **1**, 0, 0 = three 1s → FAIL → 1
- C8 (8, 9, 10, 11, 12): 0, 1, 0, 1, 0 = two 1s → OK → 0
- **Syndrome C8C4C2C1 = 0110 = 6** → flip bit 6 → corrected ✔

## 8.8 ★ Cyclic Redundancy Check (CRC)

### Theory (the worksheet's worked example and links [ED]; supplementary explanation)
- Sender and receiver agree on a **generator G** of **r + 1 bits** (equivalently a **polynomial of degree r**), e.g. **x³ + 1 ↔ 1001**, **x³ + x² + 1 ↔ 1101**, **x³ + x + 1 ↔ 1011**.
- **Polynomial ↔ bits**: write a 1 for every power present, from the highest power down to x⁰. E.g. x³ + x + 1 = 1·x³ + 0·x² + 1·x¹ + 1·x⁰ → **1011**.

**Sender** (the method used in the worksheet [ED]):
1. **Append r zeros** to the data (r = degree of G = number of bits in G − 1).
2. **Divide** by G using **modulo-2 long division** (XOR, no borrows).
3. The **r-bit remainder R is the CRC**.
4. **Transmit data + R** (R replaces the appended zeros). The transmitted frame is **exactly divisible by G**.

**Receiver**: divides the whole received frame by G. **Remainder 0 → accept; non-zero → error detected** ([ED]: *"Since the remainder is non-zero, we know that something went wrong!"*).

**Modulo-2 division rules**:
- If the leading bit of the current window is **1**, XOR it with G; if it is **0**, XOR with 0000 (i.e. just bring down the next bit).
- XOR: 0⊕0 = 0, 1⊕1 = 0, 0⊕1 = 1⊕0 = 1.

### ★ Why modulo-2 arithmetic? (worksheet question [ED])
SUPPLEMENTARY: modulo-2 addition and subtraction are the **same operation (XOR)**, with **no carries or borrows**. This makes division:
- **simple and fast in hardware**: a CRC is just a **shift register with XOR gates**;
- **mathematically consistent**: polynomial arithmetic over GF(2), which gives CRC its strong detection properties (all single-bit errors, all double-bit errors with a suitable G, all odd-numbered errors if G has the factor (x + 1), and **all bursts of length ≤ r**).

### Worksheet example CR0 [ED] (verified)
*Message 11001001, G = x³ + 1 = 1001.*
- Append 000 → 11001001**000**; dividing by 1001 gives **remainder 011** (quotient 1101 0011).
- **Transmit 11001001 011.**
- If the **leftmost bit flips** → received 01001001011 → remainder **010** (the worksheet writes it as "10") → non-zero → **error detected** ✔.

### ★ Worked example CR1 (Exam Q2(b), 4 marks): data 101110, G = 1001
r = 3 → append **000** → dividend **101110000**

```
            1 0 1 1 1 0 0 0 0
            1 0 0 1                  ← leading 1: XOR with 1001
            ───────
            0 0 1 0 1 0 0 0 0
                1 0 1 0              ← next window starting with 1
                1 0 0 1
                ───────
                0 0 1 1 0 0 0
                    1 1 0 0
                    1 0 0 1
                    ───────
                    0 1 0 1 0
                      1 0 1 0
                      1 0 0 1
                      ───────
                      0 0 1 1   ← remainder (last 3 bits) = 011
```
Step by step (each XOR shown on a 4-bit window):
1. 1011 ⊕ 1001 = 0010 → working value 001010000
2. 1010 ⊕ 1001 = 0011 → 000011000
3. 1100 ⊕ 1001 = 0101 → 000001010
4. 1010 ⊕ 1001 = 0011 → 000000011

**Remainder R = 011.** **Transmitted bit string = 101110 011.**
**Check**: 101110011 ÷ 1001 leaves remainder 000 ✔.

### ★ Worked example CR2 (T2-2026 Q3, 6 marks): data 110101, G = 1011 (x³ + x + 1)
**(a)** Degree 3 → append **3 zeros** → **110101000** (1 mark).

**(b)** Division:
1. 1101 ⊕ 1011 = 0110 → 011001000
2. 1100 ⊕ 1011 = 0111 → 001111000
3. 1111 ⊕ 1011 = 0100 → 000100000
4. 1000 ⊕ 1011 = 0011 → 000001100
5. 1100 ⊕ 1011 = 0111 → 000000111

```
110101000
1011
────
 1100            (0110 → bring down: 1100)
 1011
 ────
  1111
  1011
  ────
   1000
   1011
   ────
     1100        (0011 → bring down two bits: 1100)
     1011
     ────
      111        ← remainder
```
**CRC remainder = 111.**

**(c)** Transmitted bit string = **110101 111**. Check: 110101111 ÷ 1011 → remainder 000 ✔.

### ★ Worked example CR3 (T1B Q2, 16 marks): message 10011010, G = x³ + x² + 1
**(a)** Polynomial → bits: x³ + x² + 0·x + 1 → **1101** (r = 3). Append 000 → **10011010000**.

| Step | Window | ⊕ 1101 | Result | Working value |
|---|---|---|---|---|
| 1 | 1001 | 1101 | 0100 | 01001010000 |
| 2 | 1001 | 1101 | 0100 | 00100010000 |
| 3 | 1000 | 1101 | 0101 | 00010110000 |
| 4 | 1011 | 1101 | 0110 | 00001100000 |
| 5 | 1100 | 1101 | 0001 | 00000001000 |
| 6 | 1000 | 1101 | 0101 | 00000000101 |

```
10011010000
1101
────
 1001
 1101
 ────
  1000
  1101
  ────
   1011
   1101
   ────
    1100
    1101
    ────
       1000      (0001 → bring down 3 bits → 1000)
       1101
       ────
        101      ← remainder
```
**Remainder = 101** → **transmit 10011010 101**.
Polynomial view: M(x) = x⁷ + x⁴ + x³ + x; x³M(x) = x¹⁰ + x⁷ + x⁶ + x⁴, and the remainder mod (x³ + x² + 1) is x² + 1 ↔ 101 ✔.

**(b)** Leftmost bit inverted → received **00011010101**. Divide by 1101: the only step is 1101 ⊕ 1101 at positions 4–7 → 00000000101 → **remainder 101 ≠ 000** → the receiver knows an **error has occurred**, because a correct frame is **exactly divisible** by G (remainder 0). It then discards the frame and requests retransmission (ARQ).

### Worked example CR4: the worksheet CRC-8 [ED] (verified)
- CRC-8 polynomial: **x⁸ + x² + x + 1** → **100000111**.
- Data 1011 0011 0101 0110 + 8 zeros → remainder **1101 0101** → transmit **1011 0011 0101 0110 1101 0101** ✔ (worksheet result confirmed).
- **7th bit flipped** → received 1011 0**0**01 0101 0110 1101 0101 → remainder **0010 1010 (101010)** ≠ 0 → **error detected** ✔ (matches the worksheet image).

### Worked examples CR5 (worksheet Kurose problems [ED], verified)
*G = 10011 (r = 4).*
| D | Remainder R | Transmitted D·R |
|---|---|---|
| **1010101010** | **0100** | 1010101010 0100 |
| (a) 1000100101 | **1000** | 1000100101 1000 |
| (b) 0101101010 | **1111** | 0101101010 1111 |
| (c) 0110100011 | **1110** | 0110100011 1110 |

Division for the main case D = 1010101010 (append 0000 → 10101010100000):
1. 10101 ⊕ 10011 = 00110 → 00110010100000
2. 11001 ⊕ 10011 = 01010 → 00010100100000
3. 10100 ⊕ 10011 = 00111 → 00000111100000
4. 11110 ⊕ 10011 = 01101 → 00000011010000
5. 11010 ⊕ 10011 = 01001 → 00000001001000
6. 10010 ⊕ 10011 = 00001 → 00000000000100 → **R = 0100** ✔

### Worked example CR6 (worksheet [ED]): M(x) = 110001110110, G(x) = x⁵ + x² + x + 1
- G = x⁵ + 0x⁴ + 0x³ + x² + x + 1 → **100111** (r = 5) → append 00000.
- Steps (6-bit windows): 110001⊕100111 = 010110; 101101⊕100111 = 001010; 101010⊕100111 = 001101; 110111⊕100111 = 010000; 100000⊕100111 = 000111; 111000⊕100111 = 011111; 111110⊕100111 = 011001; 110010⊕100111 = 010101.
- **Remainder = 10101** → **T(x) = 110001110110 10101**.

## 8.9 Comparison of the four techniques (assembled)

| Method | Redundancy | Detects | Corrects | Strength | Weakness |
|---|---|---|---|---|---|
| Single parity | 1 bit | All **odd**-numbered errors (all single-bit) | No | Cheapest | Misses even-numbered errors (~50% of bursts) |
| 2-D parity | Row + column bits | All 1-, 2-, 3-bit errors; many bursts | **Single-bit** | Simple correction | Misses some 4-bit rectangles |
| Internet checksum | One word (16 bits in IP/TCP; 4 in exercises) | Most errors | No | Simple software (addition) | Misses reordered words and compensating errors |
| Hamming | r bits, 2^r ≥ m + r + 1 | Single (and double with an extra overall parity bit) | **Single-bit** | Forward correction, no retransmission | Weak against bursts |
| CRC | r bits (degree of G) | All single, all odd (with x + 1), **all bursts ≤ r** | No (detect + ARQ) | Very strong; simple hardware | Detection only |

**Where they appear in the module's technologies** [BT]: Bluetooth uses **1/3-rate FEC** (send each bit 3 times, majority vote) on the 18-bit header, a **2/3-rate FEC** that is a **(15, 10) shortened Hamming code** (corrects all single and detects all double errors), an **8-bit HEC** on the header, a **16-bit CRC** on payloads, and **ARQ**. Full detail in Part 3.

## 8.10 Examination focus — Topic 8

| Question | Paper | Marks |
|---|---|---|
| Hamming: 10101111, check bits + codeword | Exam Q2(a) | 4 |
| Hamming: 11001010 (inequality, placement, codeword) | T2-2026 Q2 | 8 |
| CRC: 101110, G = 1001 | Exam Q2(b) | 4 |
| CRC: 110101, G = 1011 | T2-2026 Q3 | 6 |
| CRC: 10011010, x³ + x² + 1 + leftmost bit flipped | T1B Q2 | 16 |
| Checksum: 1001 1100 1010 0011 | Exam Q2(c) | 2 |
| Checksum: 1010 1100 0110 1001 + receiver result | T2-2026 Q4 | 4 |
| Single-bit vs burst; parity appropriateness | T1B Q1, T2-2026 Q5–6 | 10, 8 |

## 8.11 Topic 8 revision summary
- Detection: append check bits, recompute, compare. **ARQ** retransmits; **FEC** corrects.
- **Single-bit** = 1 bit changed; **burst** = ≥ 2 bits, length from first to last bad bit.
- **Parity** detects odd numbers of errors (all single-bit), misses even numbers (unreliable for bursts), **cannot correct**.
- **Checksum**: one's-complement sum with **end-around carry**, then **complement**. Receiver sum = **all 1s** if OK. Exam: **1011**; T2-2026: **1000** (receiver 1111).
- **Hamming**: **2^r ≥ m + r + 1** (8 data → 4 check bits, 12-bit codeword); P1, P2, P4, P8; syndrome = position of the error. 10101111 → **1010 0100 1111**; 11001010 → **0011 1000 1010**.
- **CRC**: append r zeros, XOR-divide by G, remainder = CRC; receiver remainder 0 = OK. 101110/1001 → **011**; 110101/1011 → **111**; 10011010/1101 → **101**.
