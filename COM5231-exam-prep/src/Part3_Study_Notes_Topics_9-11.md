# Part 3 — Detailed Study Notes: Topics 9–11

**Topics in this part**
9. Wireless LANs: IEEE 802.11
10. Bluetooth, IEEE 802.15 and ZigBee
11. Routing and Ad Hoc Network Routing (SUPPLEMENTARY: no lecture notes were provided)

**Source codes used in this part**

| Code | File |
|---|---|
| **[WL n]** | *WLANS_v2.pptx*, slide n |
| **[FZ]** | *Chapter 15 WLANS by Forouzan.pdf* |
| **[BT-B]** | *BLUETOOTH AND IEEE 802.15_V2.pdf* (Beard & Stallings Ch. 12) |
| **[BT-S n]** | *Bluetooth and IEEE 802.15.pptx*, slide n (image-only slides, read visually) |
| **[BTX n]** | *Bluetooth_Exercises_Reordered_20_Questions.pdf*, question n |
| **[AT]** | *Fundamentals of Communications Access Technologies.pdf* |
| **[WCP]** | *Wireless Communication Problems.pdf* |

---

# TOPIC 9 — WIRELESS LANs (IEEE 802.11)

## 9.1 Introduction
A **LAN** interconnects computers within a small area (home, school, lab, office building) using network media. A **WLAN** links two or more devices using a **wireless medium** within such an area. It is sometimes called **wireless Ethernet**, and in the USA and elsewhere the public uses **WiFi** (*wireless fidelity*) as a synonym [WL 1]. Strictly, WiFi is a WLAN **certified by the WiFi Alliance**, a non-profit association of 300+ companies [FZ].

WLANs are a fast-growing market that brings the flexibility of wireless access into office, home and production environments. They are typically restricted to buildings, a campus or single rooms. **Goal: replace office cabling, and add flexibility for ad hoc communication** (e.g. group meetings) [WL 2].

**Exam weight**: very high. Hidden node, CSMA/CA, ACKs, two ISPs on channel 11, wired vs wireless LANs and co-channel interference together account for about **20 marks of the exam** and much of Test 1 and Test 2.

## 9.2 Key definitions

| Term | Definition | Source |
|---|---|---|
| **BSS (Basic Service Set)** | The building block of a WLAN: stationary or mobile wireless stations and an **optional** central base station, the **access point (AP)** | [WL 10], [FZ] |
| **Ad hoc BSS** | A BSS **without an AP**: a stand-alone network that **cannot send data to other BSSs**; stations send frames directly to each other | [WL 10], [FZ] |
| **Infrastructure BSS** | A BSS **with an AP**; each client associates with an AP that connects to other networks | [WL 11] |
| **ESS (Extended Service Set)** | Two or more BSSs with APs, connected through a **distribution system** (wired or wireless, usually Ethernet) | [WL 11], [FZ] |
| **Access point (AP)** | A radio that is a **wireless portal**: it **controls medium access** and acts as a **bridge** to other wireless or wired networks | [WL 5], [FZ] |
| **SSID** | **Service set identifier**: the logical **name** of an 802.11 network | [FZ] |
| **DCF** | **Distributed coordination function**: the fundamental 802.11 MAC mechanism, based on **CSMA/CA** | [WL 19] |
| **PCF** | **Point coordination function**: **optional, centralized, contention-free** polling by the AP (infrastructure only) | [WL 19, 40] |
| **NAV** | **Network allocation vector**: a timer showing how long other stations must wait before checking whether the channel is idle | [WL 37] |
| **IFS** | **Interframe space**: a waiting time before transmitting. Its length sets the **priority** (SIFS < PIFS < DIFS) | [WL 34] |

## 9.3 WLAN characteristics, design goals, wired vs wireless

### Advantages and disadvantages [WL 3]
| Advantages | Disadvantages |
|---|---|
| **Very flexible** within radio coverage | **Low bandwidth** compared to wired (~11–54 Mbit/s in the slide), because of radio limits, **higher error rates** from interference, and **higher delay/delay variation** from extensive error correction and detection |
| **Ad hoc networks without previous planning** | **Lower QoS** |
| Allows small, **independent devices** | **Proprietary solutions**; standards take time (slow standardisation) |
| **More robust against disasters** (earthquakes, fire) | Enhanced features only work in a **homogeneous** environment (same-vendor adapters) |
| | Must follow many **national restrictions**; global solutions are slow |

### Design goals [WL 4]
Global, seamless operation; **low power** for batteries (power-saving modes); **no special permissions or licences** (licence-free band); **robust** transmission; **easy to use**, simple management; **protection of investment in wired networks** (same data types and services); **security** (no one reads others' data), **privacy** (no user profiles collected), **safety** (low radiation).

### ★ Wired LAN vs wireless LAN [FZ] (Asked in: T2-2025 Q5, 10 marks)

| Aspect | **Wired LAN** | **Wireless LAN** |
|---|---|---|
| **Medium** | Wires; dedicated/switched links | **Air**; the signal is **broadcast**, all hosts **share** the medium (multiple access) |
| **Hosts** | Connected at a fixed point, with a link-layer address tied to the NIC; must be physically connected | **Not physically connected**; can **move freely** while using the network |
| **Isolated LAN** | Hosts connected via a **link-layer switch** | **Ad hoc network**: hosts communicate freely, **no AP** |
| **Connection to other networks** | Via a **router** | Via an **access point** that **glues two environments** (wireless ↔ wired); different role from a switch |
| **Moving between them** | Only the lower two layers differ. Change the NICs and replace the switch with an AP: **MAC addresses change, IP addresses stay the same** | |
| **Access control** | **CSMA/CD** | **CSMA/CA** (CD doesn't work in wireless) |
| **Characteristics** | Negligible attenuation and interference | **Attenuation, interference, multipath propagation, higher error rate** |

### ★ Unique concerns a wireless LAN designer must address (T2-2025 Q5, second half)
From the notes [FZ characteristics; WL 3–4; WL 16, 29; WCP]:
1. **Attenuation / path loss**: signal strength drops quickly with distance and through walls → place APs carefully, add APs for coverage [WCP path loss].
2. **Interference**: co-channel and adjacent-channel interference from other WLANs, Bluetooth and microwave ovens in the crowded **2.4 GHz ISM band** → channel planning, 5 GHz [WL 23, WCP].
3. **Multipath propagation and fading** → equalisation, antenna diversity, MIMO, OFDM, lower data rates [WCP].
4. **Higher error rate** → ACKs and retransmission, FEC, **fragmentation** [FZ].
5. **Medium access without collision detection**: hidden and exposed stations → CSMA/CA, RTS/CTS, NAV [FZ].
6. **Mobility**: hosts move between BSSs/ESSs (BSS-transition, ESS-transition mobility) → association, handoff [FZ].
7. **Limited power / battery** → power-saving modes [WL 4].
8. **Security and privacy**: broadcast medium, anyone in range can listen → authentication and encryption [WL 4, 27].
9. **Licence-free spectrum regulation**: power limits (≤ 1 W, typically 50 mW), national restrictions [WL 23, WL 3].
10. **QoS and capacity**: shared, lower bandwidth → rate adaptation, PCF for time-sensitive traffic [WL 6, 23, 40].

## 9.4 Infrastructure vs ad hoc networks [WL 5–9]
**Infrastructure-based**:
- Provides **access to other networks**. Communication is typically **only between wireless nodes and the AP**, not directly between nodes.
- The AP **controls medium access** and acts as a **bridge**.
- Several BSSs + a fixed network can form **one logical network** beyond radio coverage.
- Network functionality lies in the AP, so **clients stay simple**.
- If **only the AP controls access, no collisions** are possible, which is useful for **QoS** (the AP can **poll** nodes to guarantee data rates).
- **Loses flexibility**: can't be used for disaster relief if no infrastructure is left.

**Ad hoc**:
- **No infrastructure**, so the **greatest flexibility**; no AP controls access.
- **Each node is more complex**: it implements medium access and **forwards data**.
- Nodes communicate **only if within each other's radio range, or if other nodes forward the message**.
- **802.11 and HiperLAN2** are typically infrastructure-based but also support ad hoc. **Bluetooth is a typical ad hoc network.** (HiperLAN = European high-performance radio LAN standard, similar to WiFi.)

## 9.5 IEEE 802.11 architecture [WL 10–14, FZ]
- **BSS** (ad hoc or infrastructure) and **ESS** (BSSs connected by a **distribution system**). The ESS has **mobile stations** (normal stations inside a BSS) and **stationary stations** (APs that are part of the wired LAN).
- Stations within reach can communicate **without the AP**. Communication **outside the BSS goes via the AP**. This is like a cellular network: **BSS ≈ cell, AP ≈ base station** [WL 11 notes].
- A mobile station **can belong to more than one BSS** at the same time [FZ].

**Station types by mobility** [FZ]:
| Type | Meaning |
|---|---|
| **No-transition** | Stationary, or moving only inside one BSS |
| **BSS-transition** | Moves between BSSs **within one ESS** |
| **ESS-transition** | Moves from one ESS to another; **802.11 does not guarantee continuous communication** during the move |

### Channels and association [WL 12–13]
- The spectrum is **divided into channels** at different frequencies. The **AP administrator chooses the AP's channel**. **Interference is possible: a neighbouring AP may choose the same channel!**
- An arriving host must **associate** with an AP:
  - it **scans channels** listening for **beacon frames** containing the AP's **SSID and MAC address**;
  - it **selects** an AP and may perform **authentication**.
- **Passive scanning**: (1) APs send beacon frames; (2) the host sends an **association request** to the selected AP; (3) the AP sends an **association response**.
- SUPPLEMENTARY: **active scanning**: the host broadcasts a **probe request**, APs reply with **probe responses**, then association request/response.

SUPPLEMENTARY (needed for the channel 1/11 question): the 2.4 GHz band (2.4–2.4835 GHz) has **11 channels** (US) spaced **5 MHz** apart, but each 802.11b/g signal is about **22 MHz wide** (see [WC-S 4]: a 22 MHz signal at 2.412 GHz occupies 2.401–2.423 GHz). So adjacent channels **overlap**, and only **channels 1, 6 and 11 are non-overlapping**.

## 9.6 Protocol architecture [WL 15–19, FZ]
- 802.11 covers the **physical and data-link layers**.
- The data-link layer is split into:
  - **LLC (logical link control)**: framing, flow and error control; a **common interface** between the network layer and the 802.11 MAC; identifies/multiplexes higher-layer protocols and **hides MAC details**.
  - **MAC (medium access control)**: decides **who transmits next**. 802.11 defines two MAC sublayers: **DCF** (bottom, contention, CSMA/CA) and **PCF** (top, optional, contention-free polling).
- **Three classes of multiple access protocols**: **channel partitioning** (incl. CDMA), **random access**, **taking turns**. 802.11's random access protocol is **CSMA/CA** [WL 15].

```
 ┌───────────────────────────────┐
 │           LLC                 │
 ├───────────┬───────────────────┤
 │           │ PCF (contention-  │  ← optional, AP polling
 │   MAC     ├───────────────────┤
 │           │ DCF (CSMA/CA)     │  ← contention service
 ├───────────┴───────────────────┤
 │ PHY: FHSS │ DSSS │ IR │ OFDM… │
 └───────────────────────────────┘
```

## 9.7 Physical layer [WL 21–26]
- Bands: **2.4–2.485 GHz** and **5.1–5.8 GHz**. The 2.4 GHz band is **unlicensed** and shared with phones and **microwave ovens**. At 5 GHz, range is **shorter** for a given power and **multipath** is worse, but there is **less interference**.
- All except infrared use **short-range radios in the ISM bands**: unlicensed, with a radiated power of **at most 1 W (50 mW typical)**. Garage door openers, cordless phones and microwaves compete for the same spectrum. **2.4 GHz is more crowded than 5 GHz.**
- **Rate adaptation**: each PHY defines **multiple rates**. A weak signal uses a **low rate**; a clear signal uses the **highest** rate.
- 802.11n, ac and ax use **MIMO**.

| Standard | Technique | Band | Modulation | Data rate |
|---|---|---|---|---|
| 802.11 FHSS | Frequency hopping (79 × 1 MHz sub-bands) | 2.4 GHz ISM | 2- or 4-level FSK | 1 or 2 Mbps |
| 802.11 DSSS | Direct sequence | 2.4 GHz ISM | BPSK or QPSK | 1 or 2 Mbps |
| 802.11 Infrared | Infrared light, 800–950 nm (not ISM) | — | **Pulse position modulation (PPM)** | 1 or 2 Mbps |
| **802.11a** | **OFDM** (with QAM) | **5 GHz** (5.725–5.850 GHz) | QAM | up to **54 Mbps** |
| **802.11b** | **HR-DSSS** | 2.4 GHz | — | **5.5 and 11 Mbps** |
| **802.11g** | **OFDM + FEC** | 2.4 GHz (compatible with b) | — | **22 or 54 Mbps** |
| **802.11n** | **MIMO** (+ OFDM) | 2.4/5 GHz | — | up to **600 Mbps** |

> **NOTES ERROR**: [WL 24–26] write the 2.4 GHz band as "2.400–**4.835** GHz". It should be **2.400–2.4835 GHz** (the same slides correctly say 2.4–2.485 GHz on slide 21).

## 9.8 MAC functions [WL 27–28]
The 802.11 MAC covers three areas: **reliable data delivery, access control, security**.

**Reliable data delivery**: the physical and MAC layers are **unreliable** (noise, interference, propagation effects), so many frames are lost. Reliability could be left to higher layers such as **TCP**, but 802.11 adds a **frame exchange protocol at the MAC layer**:
- **Two-frame exchange**: the receiver returns an **ACK**. If the source gets no ACK within a short time (the data or the ACK was damaged), it **retransmits**.
- **Four-frame exchange** (more reliable): **RTS → CTS → DATA → ACK**.
  - **RTS** alerts all stations **within range of the source** that an exchange is under way, so they refrain from transmitting.
  - **CTS** alerts all stations **within range of the destination**.

## 9.9 ★ Why not CSMA/CD in wireless? [WL 16, WL 29, FZ]
Wireless LANs **cannot implement CSMA/CD** for three reasons:
1. **Send and receive at the same time**: to detect a collision a station must transmit and listen simultaneously (full duplex). That means **costly stations and more bandwidth**. Battery-powered hosts don't have the power. Also, **received signals are much weaker than transmitted ones** [WL 16].
2. **Hidden station problem**: collisions may happen **without being detected**.
3. **Distance / fading**: stations can be far apart; **signal fading** may prevent a station at one end from hearing a collision at the other end.

## 9.10 ★ The hidden station (hidden terminal) problem [FZ, WL 30, 39, 44]

Using the exam's **Figure 2**: three nodes **A, B, C** in a row. Each circle is a node's transmission range. **B is within range of both A and C, but A and C are out of each other's range.**

```
     ( A )( B )( C )         A ◄──in range──► B ◄──in range──► C
   ┌───────┐                 A and C cannot hear each other
   │   A   │──┐
   └───────┘  │ B ┌───────┐
              └───│   C   │
                  └───────┘
```

- **Problem**: A senses the channel, hears nothing (C is out of range), and starts sending to B. C also senses an idle channel (it can't hear A) and starts sending to B. **Both frames collide at B**, but **neither A nor C can detect it**. A and C are **hidden from each other with respect to B**.
- **Consequences**: frames are lost, retransmissions follow, and **capacity is reduced** [FZ]. Hidden stations can also be caused by **obstacles** [FZ].
- **What happens if A and C send simultaneously** (Exam Q5(b), T1A Q8): both start transmitting because each senses the medium idle. Their signals **overlap at B**, so B receives a **garbled** frame and decodes neither. A and C keep transmitting their whole frames (no collision detection), wasting the channel. Neither gets an **ACK**, so both time out, **back off a random time and retransmit**.

### ★ Solution: RTS/CTS handshake [FZ, WL 39, 43]
- Before sending data, the source sends an **RTS** that includes the **duration** it needs. The destination replies with a **CTS** that also carries the duration.
- **Key point**: the **CTS** is heard by **everyone in range of the receiver**, including the hidden station. In Forouzan's figure (B sending to A, with C hidden from B): B's RTS reaches A but not C. Because both B and C are in range of A, **A's CTS reaches C**. C learns that a hidden station is using the channel and **refrains until that duration is over**.
- *"The CTS frame in the CSMA/CA handshake can prevent collision from a hidden station"* [WL 43].

## 9.11 ★ CSMA/CA and DCF: the complete procedure [WL 32–35, FZ]

**Interframe spaces** [WL 34]. A shorter IFS means **higher priority**:
| IFS | Length | Used for |
|---|---|---|
| **SIFS** (short IFS) | **Shortest** (highest priority) | **Immediate responses**: ACK after data, CTS after RTS, data after CTS |
| **PIFS** (PCF IFS) | Middle | The **point coordinator (AP)** issuing **polls** in PCF; takes precedence over contention traffic |
| **DIFS** (DCF IFS) | **Longest** | **Ordinary (contention) traffic** |

**DCF algorithm** [WL 32–33, 35]:
1. A station with a frame **senses the medium** (checks the energy level at the carrier frequency [FZ]).
2. If **idle**, it waits **one IFS (DIFS)**. If still idle, it may transmit.
3. If **busy** (initially or during the IFS), it **defers** and monitors until the current transmission ends.
4. After that, it waits **another DIFS**. If idle, it waits a **random backoff** time and senses again.
5. **During backoff**, if the medium becomes busy, the **backoff timer freezes** and **resumes** when the medium becomes idle. When the counter reaches **zero**, the station transmits.
6. Optional **RTS → (SIFS) → CTS → (SIFS) → DATA → (SIFS) → ACK** exchange.
7. Other stations set their **NAV** and defer.
8. **No ACK (or no CTS) = assume a collision**: perform another backoff and retry.

### Frame exchange timeline [FZ Fig 15.7]
```
Source:      |DIFS| RTS |      | SIFS |   DATA   |      |
Destination:            |SIFS| CTS  |           |SIFS| ACK |
Others:                 |<========= NAV (no channel sensing) ========>|
```

### Network allocation vector (NAV) ★ [WL 37, FZ]
*How is collision avoidance accomplished? The key is NAV.* The RTS includes the **duration** the sender needs. Stations that hear it set a **NAV timer** showing how long to wait before even **checking the channel**. Before sensing the physical medium, each station **first checks whether its NAV has expired**. This is **virtual carrier sensing**.

### Collision during handshaking [WL 38, FZ]
Two stations may send **RTS frames at the same time**, and they collide. There is **no collision detection**, so a sender **assumes a collision if no CTS arrives**, applies the **backoff strategy**, and tries again. (RTS frames are short, so a collision wastes little time.)

### ★ Applying CSMA/CA to Figure 2: A sends a frame to B (Exam Q5(c), T1A Q9)
1. A **senses** the medium (and its NAV). It is idle, so A waits **DIFS**, then (if still idle) completes a **random backoff**.
2. A sends an **RTS** to B with the duration of the whole exchange. **B** hears it (C does not).
3. B waits **SIFS** and replies with a **CTS** that also carries the duration. **Both A and C hear the CTS** (C is in B's range). **C sets its NAV** and stays silent, even though it can't hear A.
4. A waits **SIFS** and sends **DATA** to B.
5. B waits **SIFS** and returns an **ACK**. When the NAV expires, the medium is free and C may contend (DIFS + backoff).
6. If A gets **no CTS or no ACK**, it assumes a collision, **doubles its backoff window** (SUPPLEMENTARY: binary exponential backoff) and retries.

## 9.12 The exposed station problem [FZ, WL 31, 45–46]
- **A is transmitting to B. C wants to send to D**, which would **not** interfere with A→B. But C is **within A's range**, so it hears A's transmission and **refrains**. **C is too conservative and wastes capacity.**
- **RTS/CTS does not help**: C hears A's RTS and stays quiet, because it cannot know that its transmission wouldn't affect the zone between A and B.

```
   D ◄── C        A ──► B
         (C hears A, so stays silent, although C→D would not hurt B)
```

## 9.13 Point coordination function (PCF) [WL 40–42, FZ]
- **Optional**; only in **infrastructure** networks (not ad hoc); implemented **on top of DCF**; used mostly for **time-sensitive** traffic.
- **Centralised polling**: the **AP (primary)** polls stations (**secondaries**) one after another, and they send any data they have **to the AP**. All exchanges go through the primary, which decides who uses the channel. **Poll and select** functions prevent collisions.
- **Drawback**: if the **primary station fails, the system goes down**.
- **Priority over DCF**: PCF uses **PIFS**, which is **shorter than DIFS**.
- **Repetition interval** [WL 42; SUPPLEMENTARY detail]: time is divided into repeating **superframes**. Each starts with a **beacon**, followed by a **contention-free period** (PCF polling) and then a **contention period** (DCF), so both kinds of traffic coexist.

## 9.14 Fragmentation [FZ]
The wireless environment is **very noisy**, so frames are often corrupted. 802.11 recommends **fragmentation**: dividing a large frame into smaller ones, because **resending a small frame is more efficient than resending a large one**.

## 9.15 ★ Why acknowledgements in 802.11 but not wired Ethernet? (Exam Q5(d), T1A Q10)
- In **CSMA/CD Ethernet**, collision detection serves two purposes: a **detected** collision means resend, and the **absence** of a collision acts as **a kind of acknowledgement** that the frame got through [FZ]. Wired links also have **very low error rates**.
- In **802.11**, stations **cannot detect collisions** (no simultaneous send/receive, hidden stations, fading) [WL 16, 29]. And wireless frames are often lost to **noise, interference and propagation effects** [WL 27]. *"Acknowledgment is needed in this protocol because the station does not have any means to check for the successful arrival of its data at the destination"* [FZ]. So the receiver **returns an ACK**, and **no ACK = retransmit** [WL 27].

## 9.16 ★ Co-channel interference in WiFi (T1A Q13, 4 marks)
Why many WiFi networks have a **high error rate** from co-channel interference:
- The AP administrator **chooses the channel**, and **neighbouring APs may choose the same channel** [WL 12].
- **2.4 GHz is crowded**: few non-overlapping channels (1, 6, 11 — SUPPLEMENTARY), shared with cordless phones, Bluetooth and **microwave ovens** [WL 21, 23].
- **Inward / co-channel interference** comes from products using **similar radio frequencies** nearby, which **block transmissions or cause bit errors** [WCP].
- **ISM users have no regulatory protection** and must tolerate interference [WC-S 10].
- Hidden stations in other BSSs on the same channel cause **collisions that CSMA/CA can't prevent**.
- **Result**: corrupted frames, failed ACKs, retransmissions, backoffs and lower throughput.

## 9.17 Topic 9 revision summary
- WLAN = wireless LAN = "wireless Ethernet" = WiFi (certified). **BSS** (ad hoc or infrastructure with AP), **ESS** = BSSs + distribution system; SSID; station mobility types.
- Association: scan for **beacons** (SSID, MAC) → association request/response. AP channel is chosen by the admin, and neighbours may clash.
- Stack: **LLC + MAC (DCF/CSMA/CA + optional PCF)**; PHY variants (FHSS, DSSS, IR/PPM, a/g OFDM 54 Mbps, b HR-DSSS 11 Mbps, n MIMO 600 Mbps). 2.4 GHz crowded; 5 GHz shorter range, less interference. **Rate adaptation.**
- **No CSMA/CD**: can't send+receive; hidden station; fading.
- **CSMA/CA**: sense → DIFS → random backoff (frozen while busy) → RTS/SIFS/CTS/SIFS/DATA/SIFS/ACK. **NAV** = virtual carrier sense. **SIFS < PIFS < DIFS.** No CTS/ACK → backoff and retry.
- **Hidden station**: A and C both reach B but not each other → collision at B. **RTS/CTS fixes it**: the CTS reaches the hidden node.
- **Exposed station**: C needlessly defers; RTS/CTS can't fix it.
- **PCF**: AP polling, PIFS, infrastructure only, single point of failure.
- **ACKs**: no collision detection plus high error rates.

---

# TOPIC 10 — BLUETOOTH, IEEE 802.15 AND ZIGBEE

## 10.1 Introduction: short-range communication and the IoT [BT-B 12.1, BT-S 2–4]
Short-range technologies (a few metres) focus on **low cost and low energy** for long battery life. Several standards come from the **IEEE 802.15 working group**. They provide two services:
1. **Personal area network (PAN)**: devices within a person's working space, especially **on their bodies**, share information and communicate with the user.
2. **Internet of Things (IoT)**: **device-to-device** communication for **data collection, analysis and automation**. Examples: heart-monitoring implants, biochip transponders on farm animals, cars with sensors, devices that assist fire-fighters [BT-S 3]. IoT flow: **sensor → connectivity → data processing → user interface**, and the user can also act back on the system (e.g. adjust cold-storage temperature from a phone) [BT-S 4].

## 10.2 Bluetooth overview [BT-B 12.2, BT-S 6–8]
- An **always-on, short-range radio hookup on a microchip**. Developed by **Ericsson in 1994** so laptops could make calls via a mobile phone. Originally published as **IEEE 802.15.1**; now the **Bluetooth SIG** (special interest group) publishes the standards. Named after King **Harald Blaatand** of Denmark.
- **Key attributes: robustness, low power consumption, low cost.**
- **2.4 GHz** (globally available, unlicensed, low power). Two devices **within 10 m** can share **up to 2.1 Mbps or 24 Mbps**.
- Supports an open-ended list of applications: data, audio, graphics, video.
- **Up to 8 devices in a piconet**; **10 piconets can coexist** in the same coverage range; each link is **encoded** against eavesdropping and interference.

**Three application areas** [BT-B, BT-S 8]:
1. **Data and voice access points**: real-time voice and data, wirelessly connecting portable and stationary devices.
2. **Cable replacement**: removes proprietary cables. Connections are instant and work **without line of sight**. Range **≈ 10 m**, extendable to **100 m** with an amplifier.
3. **Ad hoc networking**: a device can connect instantly to another Bluetooth radio as soon as it comes into range.

**Uses** (Table 12.1): hands-free headset, car stereo, PC input/output, synchronisation, cable replacement (RS-232), infrared remote replacement, low-rate data transfer, bridges (Ethernet interconnection), game consoles, medical devices, security (theft prevention when the link breaks).

### ★ Why Bluetooth is a WPAN rather than a WLAN (BTX 1)
Its **range is about 10 m** (a person's personal space), it is designed for **low power and low cost** and **cable replacement** between a person's own devices, and its basic network (a piconet) holds only **8 active devices**. A WLAN covers a building or campus (tens to hundreds of metres), serves many users, and connects to wider networks.

## 10.3 Standards documents: core and profiles [BT-B]
The standards (2500+ pages) have two groups:
- **Core specifications**: details of the protocol layers, from the radio interface to link control, interoperability, testing and timers.
- **Profile specifications**: the use of Bluetooth to support **particular applications**. Each profile says which parts of the core are **mandatory, optional or not applicable** for a usage model. **Purpose: a standard of interoperability**, so products from different vendors that claim a usage model **work together**.

## 10.4 ★ Protocol architecture [BT-B, BT-S 10–20]

```
 vCard/vCal  WAE   AT        TCS BIN   SDP
   OBEX      WAP   commands
   ─────── UDP/TCP ─────
              IP
             PPP
 Audio   ──── RFCOMM ────            Control
 ────────── L2CAP (Logical Link Control and Adaptation) ──────
 - - - - - - - - - Host–controller interface - - - - - - - - -
                     Link Manager Protocol (LMP)
                            Baseband
                         Bluetooth Radio
```

**Core protocols (five-layer stack)**:
| Layer | Role |
|---|---|
| **Radio** | Air interface: **frequency, frequency hopping, modulation, transmit power** |
| **Baseband** | **Connection establishment within a piconet, addressing, packet format, timing, power control** |
| **LMP** (link manager protocol) | **Link setup** and ongoing link management, incl. **security (authentication, encryption)** and negotiation of baseband packet sizes |
| **L2CAP** | **Adapts upper-layer protocols to the baseband**; provides **connectionless and connection-oriented** services |
| **SDP** (service discovery) | Device information, services and their characteristics can be **queried** so a connection can be set up |

**Cable replacement protocol: RFCOMM** presents a **virtual serial port**, making replacement of serial cables as transparent as possible. It provides binary data transport and **emulates EIA-232 (RS-232) control signals** over the baseband.
**Telephony control protocol: TCS BIN** (telephony control specification, binary) is a **bit-oriented** protocol for **call control signalling** for speech and data calls, plus **mobility management** for groups of TCS devices.
**Adopted protocols** (Bluetooth invents only what's necessary and reuses existing standards):
- **PPP**: carries IP datagrams over a point-to-point link.
- **TCP/UDP/IP**: the foundation protocols of TCP/IP.
- **OBEX**: object exchange; a session-level protocol from **IrDA**, similar to HTTP but simpler. Content formats include **vCard** (business card) and **vCalendar**.

## 10.5 ★ Profiles [BT-B, BT-S 21]
- **Over 40 profiles**. A profile is **a set of protocols that implement a particular Bluetooth-based application**; each defines the protocols and features that support a **usage model**.
- **All Bluetooth nodes support the Generic Access Profile**; profiles may depend on other profiles.
- **Example: the File Transfer Profile** transfers directories, files, documents, images and streaming media, and can browse folders on a remote device. It **depends on the Generic Object File Exchange, Serial Port and Generic Access profiles**, uses **OBEX** within Generic Object File Exchange, and interfaces with **L2CAP and RFCOMM**.

### ★★ How profiles benefit applications despite adding complexity (Asked in: Exam Q4(c), T2-2025 Q7, T2-2026 Q7, BTX 19)
1. **Interoperability**: the purpose of a profile is a *"standard of interoperability so that products from different vendors that claim to support a given usage model will work together"* [BT-B]. A headset from vendor X works with a phone from vendor Y, so users don't care about brands.
2. **Ready-made building blocks for developers**: the profile already specifies **which protocols and features to use** (mandatory/optional/not applicable). Developers **don't redesign** the protocol stack for each application; they implement the profile, e.g. the File Transfer Profile reuses OBEX, RFCOMM and L2CAP [BT-B].
3. **Only what's needed is implemented**: an application implements only the subset of the large core specification its usage model needs. This means **smaller, cheaper, low-power devices** (key Bluetooth attributes).
4. **Reuse through dependencies**: profiles build on others (all on the Generic Access Profile), so common functions (discovery, connection setup, security) are **consistent** across all applications.
5. **Plug-and-play user experience**: devices discover each other's services (**SDP**) and connect automatically, because both sides know exactly how the application behaves.
6. **Predictable behaviour and testing**: certification against profiles makes products reliable and easier to test.

## 10.6 ★ Piconets and scatternets [BT-B, BT-S 23]
- **Piconet**: the basic unit, **one master + one to seven active slaves**.
- The **master determines the channel (frequency-hopping sequence) and phase (timing offset, i.e. when to transmit)** for all devices, **using its own device address** as a parameter. Slaves **tune to the same channel and phase**.
- **A slave may only communicate with the master, and only when granted permission by the master.**
- **Scatternet**: a device in one piconet may also be part of **another** piconet, as **slave or master in each**. This overlap is a scatternet.

```
        M                           Piconet 1          Piconet 2
      / | \                            M1                 M2
     S  S  S        scatternet:      / | \              / | \
                                    S  S  S/M2? —— bridge  S  S
```
(A device can be **slave in both**, or **master in one and slave in the other**, but **not master in both**: see 10.12.)

- **Advantage**: many devices share the same physical area and use bandwidth efficiently.
- **Frequency hopping**: **1 MHz carrier spacing**, typically up to **80 frequencies (80 MHz)**. Without hopping, a channel = one 1 MHz band. With hopping, a **logical channel = a hopping sequence**. At any time the available bandwidth is **1 MHz, shared by at most 8 devices**. **Different logical channels share the same 80 MHz.** **Collisions occur when devices in different piconets happen to use the same hop frequency at the same time**; more piconets means more collisions and poorer performance.
- **Summary**: *the physical area and total bandwidth are shared by the scatternet; the logical channel and data transfer are shared by a piconet.*

### Can a piconet have more than eight stations? (BTX 5)
Only **8 can be active** (1 master + 7 active slaves): the active-member address **AM_ADDR is 3 bits** (2³ = 8 values; 0 = broadcast, so 1–7 for slaves) [BT-S packet header]. SUPPLEMENTARY: additional devices can be **parked** (synchronised but inactive), up to 255, and activated by swapping with an active slave.

## 10.7 Radio specification [BT-B Table 12.2, BT-S 24–25]

| Parameter | Basic Rate (BR) | Enhanced Data Rate (EDR) |
|---|---|---|
| Topology | Up to 7 simultaneous links, logical star | Same |
| Modulation | **GFSK** | **π/4-DQPSK and 8DPSK** |
| Peak data rate | **1 Mbps** | **2 and 3 Mbps** |
| RF bandwidth | 220 kHz (−3 dB), 1 MHz (−20 dB) | Same |
| RF band | **2.4 GHz ISM** | Same |
| RF carriers | **23/79** | 23/79 |
| Carrier spacing | **1 MHz** | 1 MHz |
| Transmit power | 0.1 W | 0.1 W |
| Piconet access | **FH-TDD-TDMA** | Same |
| Hop rate | **1600 hops/s** | Same |
| Scatternet access | **FH-CDMA** | Same |

- **Power classes**: **Class 1**: up to **100 mW (+20 dBm)**, min 1 mW; **power control mandatory** (4–20 dBm); greatest range. **Class 2**: up to **2.5 mW (+4 dBm)**, min 0.25 mW (−6 dBm); power control optional. **Class 3**: **max 1 mW**, lowest power.
- **79 × 1 MHz physical channels** in most countries; **f = 2.402 + n MHz, n = 0…78** (US, Europe). Japan, Spain and France have 23 channels.
- **Power control** keeps devices from emitting more than necessary; implemented via **LMP** between master and slaves.
- **BR modulation: Gaussian FSK**. Binary 1 = positive frequency deviation, 0 = negative; **1 Msymbol/s × 1 bit = 1 Mbps**; minimum deviation 115 kHz.
- **EDR** (Bluetooth 2.0): the same 1 Msymbol/s with **π/4-DQPSK (2 bits) and 8DPSK (3 bits)** → 2 and 3 Mbps. The raw 3 Mbps gives **≈ 2.1 Mbps** after overhead.

**Answers to BTX 10–13**: the radio layer specifies the air interface (frequency, hopping, modulation, power). The actual bandwidth used is **1 MHz per hop channel** within the 79–80 MHz band. The spread-spectrum technique is **FHSS** (1600 hops/s). Modulation is **GFSK** (BR), with π/4-DQPSK/8DPSK for EDR. Bits become radio waves by shifting the carrier frequency up (1) or down (0).

## 10.8 ★ Baseband: frequency hopping and TDD [BT-B, BT-S 26–30]
**FH serves two purposes**:
1. **Resistance to interference and multipath** effects.
2. **Multiple access among co-located devices in different piconets.**

**FH workflow**: total bandwidth is divided into **79 physical channels of 1 MHz** → hopping jumps between them in a **pseudorandom sequence** → **the same sequence is shared by all devices in a piconet** (an "FH channel").
- **1600 hops/s**, so each channel is occupied for **0.625 ms = one slot**; slots are numbered.
- **Time division duplex (TDD)**: data go **one direction at a time**, alternating (master → slave, slave → master). With more than two devices, the access technique is **TDMA**. So piconet access = **FH-TDD-TDMA**.
- **Multislot packets**: packets can take **1, 3 or 5 slots**. The radio **stays on the same frequency** for the whole packet, then returns to the frequency its hopping sequence requires for the next slot, so **2 or 4 hop frequencies are skipped**.
- **TDD prevents crosstalk** between transmit and receive in the transceiver, which is essential for a **one-chip implementation**.
- The **FH sequence is set by the master** and is a function of the **master's Bluetooth address** (permutations and XOR).
- Different piconets have different masters, hence **different hop sequences**. Occasionally two piconets use the **same physical channel in the same slot → collision and lost data**. This is rare and is handled with **FEC and error detection/ARQ**. This is **FH-CDMA** between piconets.
- **Adaptive frequency hopping**: quality metrics let the hop sequence **avoid poor channels** (e.g. those used by WiFi). Fewer than 79 channels may be used, but **at least 20**.

**How can FH and TDD be combined? (BTX 14)**: each 625 µs slot is on a new hop frequency. The master transmits in even-numbered slots and the slave replies in the next (odd) slot **on the next hop frequency**. So **direction alternates slot by slot (TDD) while the frequency changes slot by slot (FH)**.

**Microwave ovens (BTX 16)**: yes, they can interfere. Ovens radiate around **2.45 GHz**, inside Bluetooth's **2.4 GHz ISM** band [WCP: microwave ovens operate at 2.4 GHz]. The effect is limited because Bluetooth **hops 1600 times/s across 79 channels**, so only hops landing near the oven's frequency are hit, and **adaptive frequency hopping** can avoid them. Lost packets are recovered by **FEC/ARQ**.

**MAC protocol in the baseband (BTX 17)**: **TDMA with master polling (FH-TDD-TDMA)**. Slaves send only in the slot after the master addresses them. **No contention within a piconet.**

## 10.9 ★ User logical links [BT-B, BT-S 31–35]
| Link | Description |
|---|---|
| **SCO** (synchronous connection-oriented) | **Fixed bandwidth**, point-to-point, master ↔ **one** slave. **Reserved slots at regular intervals**; the unit is **two consecutive slots** (one each way), so it is **symmetric**. A master supports **up to 3 SCO links**; a slave supports 3 to one master or 2 to different masters. **SCO packets are never retransmitted.** |
| **eSCO** (extended SCO) | Reserves slots like SCO, but **can be asymmetric** and **supports retransmission** |
| **ACL** (asynchronous connectionless) | **Point-to-multipoint** between the master and all slaves. Uses slots **not reserved for SCO/eSCO**; the master can exchange packets with any slave **per slot**. **Only one ACL link** exists. Most ACL packets are **retransmitted** if needed |

- **SCO/eSCO** carry **time-bounded data** that need a **guaranteed data rate but not guaranteed delivery**, e.g. **digitally encoded audio** tolerant of loss. The rate is guaranteed by **slot reservation**.
- **ACL** gives a **packet-switched** style connection: **no bandwidth reservation**; delivery may be guaranteed via error detection + retransmission. **A slave may send an ACL packet in the slave-to-master slot only if it was addressed in the preceding master-to-slave slot** (polling). 1-, 3- and 5-slot packets; unprotected or **2/3 FEC**. Maximum: a **5-slot unprotected** packet with asymmetric allocation gives **721 kbps forward and 57.6 kbps reverse** (Basic Rate). EDR **3-DH5** reaches **2178.1 kbps** asymmetric (Table 12.4).

## 10.10 Packet format [BT-B, BT-S 36–44]

```
|<--- 72 bits --->|<- 54 bits ->|<----- 0 to 2745 bits ----->|
|  Access code    |   Header    |          Payload           |

Access code: | preamble 4 | SYNC word 64 | trailer 4 |
Header (18 bits, sent with 1/3 FEC = 54):
| AM_ADDR 3 | Type 4 | Flow 1 | ARQN 1 | SEQN 1 | HEC 8 |
```
- **Access code**: timing synchronisation, offset compensation, paging, inquiry. Types: **CAC** (channel access code: identifies a piconet), **DAC** (device access code: paging and responses), **IAC** (inquiry access code: inquiry).
- **Header fields**:
  - **AM_ADDR (3 bits)**: active-mode address of a slave (at most 7 active slaves); **0 = broadcast** from the master.
  - **Type (4 bits)**: packet type (SCO/ACL types, error protection, number of slots). The **ID packet** (access code only, 68 bits) is used in inquiry and access procedures.
  - **Flow (1 bit)**: ACL flow control. 0 = stop sending, 1 = resume.
  - **ARQN (1 bit)**: acknowledgement for CRC-protected ACL traffic. **ACK = 1, NAK = 0**; no reply means a NAK is assumed.
  - **SEQN (1 bit)**: alternating 1/0 sequence bit to **filter out retransmissions** (duplicates caused by a failed ACK).
  - **HEC (8 bits)**: header error control, an **8-bit error-detection code** protecting the header.
- **Payload**: payload header (8 bits single-slot, 16 bits multislot), with **L_CH** (logical channel: LMP 11, start/unfragmented L2CAP 10, continuation 01, other 00), **Flow** (L2CAP-level flow control) and **Length** (bytes of data); the payload body; and a **16-bit CRC** on all data payloads (except AUX1).

## 10.11 ★ Error correction in Bluetooth [BT-S 45–50]
Three schemes:
1. **1/3-rate FEC**: used on the **18-bit header** and the voice field in **HV1** packets. It simply **sends three copies of each bit**, and **majority logic** decodes each triple.
2. **2/3-rate FEC**: used in all **DM** packets, the data field of **DV**, the **FHS** packet and **HV2**. It is a form of **Hamming code (15, 10)**: it **corrects all single errors and detects all double errors** in each codeword.
3. **ARQ**: used with **DM and DH** packets and the data field of DV. Its elements:
   - **Error detection** (CRC, supplemented by FEC)
   - **Positive acknowledgement** of error-free packets
   - **Retransmission after timeout**
   - **Negative acknowledgement and retransmission**
   ACK/NAK are carried **in the next return packet** (piggybacked in ARQN).

## 10.12 ★ Master vs base station/AP, and one device as master of two piconets

### Bluetooth master vs 802.11 base station/AP (Asked in: Exam Q4(a), T2-2026 Q8, BTX 8)
From [BT-S 74] (802.15.3 slide comparing a PNC, an 802.11 AP and a Bluetooth master): *"The AP provides a link to other networks and acts as a relay point for all MAC frames. The Bluetooth master sets up piconets and acts as a relay point for all traffic."* Combined with [BT-B] and [WL]:

| | **Bluetooth master (central)** | **802.11 AP / base station** |
|---|---|---|
| **Medium access coordination** | **Fully controls access**: sets the hop sequence and timing; **polls** slaves (TDD/TDMA); **a slave transmits only when addressed by the master**, so **no contention or collisions within the piconet** | Stations normally **contend** using **CSMA/CA (DCF)**: random backoff, collisions possible. Polling (**PCF**) is **optional** |
| **Role in connecting to other networks** | Sets up the **piconet** (an ad hoc PAN) and relays traffic **inside** it; it is **not a gateway** to a wired network or the Internet (slaves talk only to the master; inter-piconet communication is via scatternet bridge devices) | **Bridges the wireless BSS to the distribution system/wired LAN/Internet**; relays all MAC frames; ESS roaming |
| **Number of devices** | **Max 7 active slaves** (3-bit AM_ADDR) | Many stations (no such small fixed limit) |
| **Nature** | Any Bluetooth device can become master (role is temporary/dynamic) | Dedicated, usually fixed infrastructure device |
| **Range / power** | ~10 m, low power | Tens to hundreds of metres |

### Can one device be the master of two piconets at the same time? (Asked in: Exam Q4(d), T2-2025 Q9, BTX 9)
**No.** A piconet **is defined by its master**: the hopping sequence (channel) and the timing (phase) are derived from the **master's own Bluetooth address and clock** [BT-B]. If one device were master of two "piconets", **both would use the same hopping sequence and timing**, so they would be **one and the same piconet**, not two. (Its slaves would simply all be in one piconet, limited to 7.) A device **can** be in two piconets as **slave in both**, or **master in one and slave in the other**, by **time-sharing** between the two hop sequences, which is how scatternets work [BT-B Fig 12.2].

## 10.13 ★ Hidden terminal problem in Bluetooth (Exam Q4(b), T2-2025 Q4)
**Within a piconet, no.** The hidden terminal problem arises with **contention-based** access like CSMA/CA, where stations decide on their own to transmit after sensing an idle channel. In Bluetooth the **master polls**: **a slave transmits only in the slot after the master has addressed it** [BT-B ACL rule], and SCO slots are **reserved**. Two slaves never transmit simultaneously by their own decision, so there is **nothing for a hidden terminal to collide with**. All slaves are within range of the master, which schedules every transmission (TDD/TDMA).
**Between piconets** (scatternet), collisions **can** occur when two piconets happen to hop to the same frequency in the same slot. But this is **FH-CDMA collision**, not a hidden terminal problem caused by carrier sensing, and it is handled by FEC/ARQ [BT-B].

SUPPLEMENTARY (Kurose & Ross's answer to the same question): "No, the hidden terminal problem does not occur in Bluetooth because the master polls; slaves only transmit when polled."

## 10.14 ★ Scatternet collision probability (Asked in: Exam Q4(e), T2-2025 Q8, BTX 20)
*Two piconets, no CSMA, 80 frequencies, both always have packets to send. A successful transmission needs a successful poll (master → slave) **and** a successful reply (slave → master).*

**Reasoning** (uses [BT-B]: each piconet hops pseudorandomly and independently over the frequencies; a collision occurs when both use the same frequency in the same slot):
1. In any one slot, both piconets transmit (always busy). Piconet 2 is on a frequency that is effectively random relative to piconet 1. **P(same frequency in one slot) = 1/80.**
2. **P(one slot is collision-free) = 1 − 1/80 = 79/80.**
3. An exchange uses **two slots** (poll + reply) on **two different hop frequencies**, so the slots are **independent**: P(both succeed) = (79/80)² = **0.9752**.
4. **P(collision affecting the exchange) = 1 − (79/80)² = 159/6400 ≈ 0.0248 ≈ 2.5%.**

**Answer: about 2.5%** (≈ 1/80 per individual packet; ≈ 2/80 per poll-reply transaction).

SUPPLEMENTARY note on assumptions: if the question means "probability that a *single packet* collides", the answer is **1/80 = 1.25%**. State both, clearly: "per packet 1/80; per successful poll+response transaction 1 − (79/80)² ≈ 2.5%". Mention that with **79** channels (real Bluetooth) the figures are 1/79 and ≈ 2.5%.

## 10.15 Bluetooth High Speed (3.0) and Bluetooth Smart (4.0) [BT-S 52–55]
**Bluetooth 3.0 + HS**: up to **24 Mbps**. It adds a **Wi-Fi connection** for higher rates: the **Alternative MAC/PHY (AMP)** (actually an 802.11 link). The Bluetooth radio still handles **device discovery, association, initial connection setup, profile configuration and connection maintenance**; AMP is used **only when higher rates are needed**. Each AMP uses a **Protocol Adaptation Layer (PAL)** to map Bluetooth protocols onto the 802.11 MAC/PHY.
**(BTX 3)**: Bluetooth 3.0 reaches 24 Mbps by **using a co-located 802.11 (Wi-Fi) radio via AMP** for the data transfer.

**Bluetooth Smart = Bluetooth Low Energy (BLE), Bluetooth 4.0** (BTX 2):
- An **intelligent, power-friendly** version; runs for long periods on a **single battery** or scavenged energy; can talk to legacy Bluetooth devices and smartphones; very successful for **IoT** (e.g. health monitors).
- Same **2.4 GHz** ISM band, but **40 channels spaced 2 MHz apart** (**3 advertising + 37 data**), instead of 79 × 1 MHz.
- Devices may implement transmitter, receiver or both; **single-mode** (BLE only, **cheap**, compact) or **dual-mode** (also BR/EDR).
- **Design features**: **10 mW** output; **150 m** range in an open field; new **advertising** mechanism for efficient discovery; new **asynchronous connectionless MAC** for low delay, fast transactions; new **generic attribute protocol** (simple client/server model); new **generic attribute profile** to collect sensor data efficiently.

## 10.16 IEEE 802.15 [BT-B 12.5, BT-S 56–80]
- The IEEE working group for **WPANs**, formed to develop standards for **short-range wireless PANs**. In a PAN all devices are **owned by one person or family** (PCs, smartphones, tablets, health monitors, smart glasses, peripherals).
- **802.15.1**: MAC and PHY from the Bluetooth specification (approved 2002, updated 2005).
- **802.15.3**: devices that are **low cost and low power** compared with 802.11 but with **higher data rates** than 802.15.1 (issued 2003). **802.15.3c**: **gigabit rates at 60 GHz**. **802.15.3d**: **100 Gbps**.
- **802.15.4**: **very low cost, very low power**, data rates **lower** than 802.15.1 (2003).
- Architecture: 802.15.1, 802.15.3 and 802.15.4 share **LLC**, with different MAC and PHY layers.

| Standard | PHY / rates |
|---|---|
| 802.15.1 Bluetooth | 2.4 GHz; 1, 2 or 3 Mbps; 24 Mbps HS |
| 802.15.3c | 60 GHz; 1–6 Gbps |
| 802.15.3d | 100 Gbps (the slide's table labels it 60 GHz; SUPPLEMENTARY: the published standard actually uses ~252–325 GHz) |
| 802.15.4 / 4e | 868/915 MHz, 2.4 GHz; DSSS 20, 40, 100, 250 kbps; UWB 110 kbps–27 Mbps; CSS 250 kbps, 1 Mbps |

### 802.15.3: high data rate WPAN [BT-S 63–68]
- Examples: cameras/phones to printers or kiosks; laptop to projector; **5:1 surround sound** speakers; video from a set-top box; music to headphones; camcorder to TV; remote viewfinders.
- **Requirements**: short range (~10 m); **high throughput (> 20 Mbps)** for video and multichannel audio; low power; low cost; **QoS** (guaranteed data rate); **dynamic environment** (devices enter and leave the piconet; mobile devices < 7 km/h); simple connectivity; **privacy**.
- **MAC**: a network of **DEVs**; one DEV is the **piconet coordinator (PNC)**, which sends **beacons**. Time is divided into **superframes**: a beacon period, a **contention access period** (command/control, **CSMA/CA**) and a **channel time allocation period** (**TDMA with guaranteed time slots, GTSs**: QoS).
- **★ PNC vs 802.11 AP vs Bluetooth master** [BT-S 64]: *the AP provides a link to other networks and acts as a relay point for all MAC frames; the Bluetooth master sets up piconets and acts as a relay point for all traffic; **the PNC controls access to the time resources of the piconet but is not involved in the exchange of data frames between DEVs**.*
- **PHY**: 2.4 GHz; five modulation formats at **11 Mbaud** give **11–55 Mbps**; **trellis-coded modulation (TCM)**.
- **802.15.3c**: 60 GHz; a common ~5 GHz-wide band worldwide; **high power, doesn't penetrate walls**; **beamforming** helps; **four 2160 MHz channels**. Usage models: (1) uncompressed HD video (1920×1080 × 24 bit × 60 fps → **> 3.5 Gbps**); (2) multivideo streaming; (3) office desktop peripherals; (4) conference ad hoc; (5) kiosk file downloading. **Three PHY modes**: single carrier 1.5/3 Gbps; high-speed OFDM up to 5.775 Gbps; audio/visual OFDM 0.952/1.904/3.807 Gbps. The MAC supports coexistence of the modes, **frame aggregation**, and optional **beamforming in three stages** (sector-level coarse search, beam-level fine search, optional tracking).
- **802.15.3d**: **100 Gbps**, low cost and power; wireless offices, data-centre point-to-point links, wireless backhaul, intra-device; a few cm to 100 m.

### 802.15.4: low rate WPAN [BT-S 69–78]
- **TG4**: a low data rate solution with **multi-month to multi-year battery life** and **very low complexity**.
- PHYs: **868/915 MHz DSSS** (20, 40, 100, 250 kbps); **2.4 GHz DSSS** (250 kbps); **UWB** impulse radio (very short pulses, low spectral density below thermal noise; 851 kbps, optionally 110 kbps, 6.81 or 27.234 Mbps; **precision ranging to within 1 m**); **2.4 GHz chirp spread spectrum (CSS)** (1 Mbps, optionally 250 kbps).
- Applications: **sensors, interactive toys, smart badges, remote controls, home automation**.
- **MAC**: **CSMA-CA** channel access, automatic network establishment from a **coordinator node**, and a **fully handshaked** protocol for reliable delivery.
- Extensions: **4c/4d** (780 and 950 MHz PHYs); **4e** (industrial: time synchronisation, **channel hopping**, low duty cycles); **4f** (**active RFID**); **4g** (**smart utility networks/smart grid**, 40–1000 kbps); **4j** (**medical body area networks**, 2.4 GHz); **4k** (**LECIM**: critical infrastructure such as roads and bridges, multi-year battery); **4m** (**TV white space**); **4p** (**rail**: Positive Train Control).
- **Other 802.15**: **802.15.2** (**coexistence** of 802.15 with 802.11 in the same bands); **802.15.6** (**body area networks**: in-, on- and around-body; narrowband, UWB, body channel); **802.15.7** (**visible light communication**, 380–780 nm, 11.67 kbps–96 Mbps; challenges: flicker and dimming).

## 10.17 ZigBee [BT-B 12.6, BT-S 81–90]
- A suite of protocols **based on IEEE 802.15.4** for **small, low-power radios**, simpler than WPANs. Suited to **low data rate, long battery life, secure networking**. Data rates **20–250 kbps**; best for **periodic or intermittent** communication. Named after the **waggle dance of honey bees**. Standards since **2003** (the Alliance formed in 1998; ZigBee ratified Dec 2004; **ZigBee PRO** 2007).
- **Features**: low cost; low power; **mesh networking** (nodes route each other's messages: reliability and range); **star, tree and mesh** topologies; **one coordinator** creates, controls and maintains the network; **wakes in 30 ms** (vs Bluetooth up to 3 s), so nodes can sleep most of the time.
- **Four components added to 802.15.4**: **network layer (routing)**; **application support sublayer (APS)**; **ZigBee device objects (ZDOs)**, the most significant addition (device roles, join requests, device discovery, security); **manufacturer-defined application objects**.
- **Stack profiles**: Profile 1 (**ZigBee**: home, light commercial); Profile 2 (**ZigBee PRO**: multicasting, higher security).
- **Application profiles**: building automation, health care, home automation, input device, Light Link, network devices, retail, remote control, Smart Energy 1.1 and 2 (IP-based), telecom services. Other specs: **ZigBee IP** (IPv6 mesh); **ZigBee RF4CE** (consumer electronics remote control).
- **★ Device types**: **Coordinator**: the most capable; **only one per network**; starts the network, is the root of a tree, maintains information such as **security keys**. **Router**: passes data on to other devices. **End device**: just enough function to talk to a router or coordinator; **cannot relay**; sleeps a lot; least memory, **cheapest**.
- **Routing**: ZigBee automatically builds low-speed **ad hoc networks**, using routing protocols to forward packets over **multiple hops**. **AODV (Ad hoc On-demand Distance Vector)** is used: it sends **route requests** and either responds or forwards them until someone responds; nodes **store and use** discovered routes and can form clusters. *(This is the only routing protocol mentioned anywhere in your notes; see Topic 11.)*
- **Networks**: **non-beacon** (unslotted CSMA/CA, routers always on, so they need permanent power) vs **beacon-based** (periodic beacons; superframe with a **contention access period** of 16 slots using CSMA/CA and an optional **contention-free period** with **GTSs**; nodes sleep between beacons, intervals 15.36 ms to 251.65824 s at 250 kbps). Beacon mode is typical for star/tree networks, non-beacon for mesh; most commercial systems use non-beacon.
- **Radio hardware**: **2.4 GHz** (16 channels, 5 MHz each, 250 kbps, **offset QPSK**); **915 MHz** (40 kbps, BPSK); **868 MHz** (20 kbps, BPSK). Range **10–75 m**, up to **1500 m with ZigBee PRO**.
- **Security**: strict key management; one **trust center**; the layer that creates a frame secures it; **128-bit keys** (network or link).

## 10.18 Topic 10 revision summary
- Bluetooth: Ericsson 1994; SIG; 2.4 GHz; 10 m (100 m); robust, low power, low cost; **core + profiles**. Stack: Radio, Baseband, LMP, L2CAP, SDP; RFCOMM; TCS BIN; PPP/TCP/IP/OBEX.
- **Profiles = interoperability + reuse + only-what's-needed** (asked 4 times).
- **Piconet**: 1 master + ≤ 7 active slaves; the master's address sets the hop sequence and timing; **slaves speak only when polled**. **Scatternet**: overlapping piconets; **FH-CDMA** between piconets; collision when the same hop in the same slot.
- Radio: 79 × 1 MHz, **1600 hops/s, 625 µs slots**, **GFSK 1 Mbps**, EDR 2/3 Mbps; classes 1/2/3.
- Baseband: **FH-TDD-TDMA**; 1/3/5-slot packets; adaptive FH (≥ 20 channels).
- Links: **SCO** (reserved, symmetric, no retransmission), **eSCO**, **ACL** (packet-switched, polled, retransmission).
- Packet: access code 72 / header 54 (18 × 3) / payload 0–2745; AM_ADDR, Type, Flow, ARQN, SEQN, HEC.
- Error control: **1/3 FEC (repetition), 2/3 FEC (Hamming 15,10), ARQ**.
- **Master vs AP**: polling (no contention) vs CSMA/CA; a piconet PAN vs a bridge to the wired network. **One master for two piconets is impossible**: the master defines the hop sequence. **No hidden terminal inside a piconet**: polling. **Scatternet collision ≈ 1 − (79/80)² ≈ 2.5%.**
- BT 3.0 HS (AMP/802.11, 24 Mbps); BT 4.0 Smart/BLE (40 × 2 MHz channels, 10 mW, 150 m).
- 802.15.3 (high rate, PNC, superframes, GTS), .3c (60 GHz Gbps), .3d (100 Gbps), .4 (low rate, years of battery), ZigBee (coordinator/router/end device, AODV, mesh).

---

# TOPIC 11 — ROUTING AND AD HOC NETWORK ROUTING

> **SUPPLEMENTARY TOPIC.** None of the uploaded files cover this topic. The course outline names *Ch. 3 Communication Networks, Ch. 4 Protocols and the TCP/IP Suite* and *Ch. 13 (Agrawal) Ad hoc Networks*, which were not provided. Everything below follows the standard textbook treatment used by these exact questions: the Figure 1 network and the count-to-infinity questions are from **Kurose & Ross, *Computer Networking*, Ch. 5**; the T2-2026 Figure is **Tanenbaum's Dijkstra example**; MANET categories follow **Agrawal & Zeng** and standard MANET literature. The only related item in your notes is **AODV**, mentioned on the ZigBee slide [BT-S 87].
>
> This topic is worth **30% of the exam paper** (and 25–32% of the Test 2 papers). Learn the Dijkstra tables below perfectly.

## 11.1 Routing, forwarding and switching ★ (Asked in: T2-2026 Q1, 6 marks)

| Process | **Purpose** | **Where / scope** | **Information used to decide** |
|---|---|---|---|
| **Routing** | Determine the **end-to-end path** (route) packets take from source to destination | **Network-wide**, **control plane**; runs over seconds/minutes; routing algorithms (Dijkstra/link-state, Bellman-Ford/distance-vector; AODV in MANETs) | **Network topology and link costs** (exchanged with other routers via routing protocols); output = the routing/forwarding table |
| **Packet forwarding** | **Move an arriving packet from a router's input link to the correct output link** | **Router-local**, **data plane**; per packet, nanoseconds | The packet's **destination network-layer (IP) address**, looked up in the **forwarding table** (longest prefix match) |
| **Switching** | Move **frames** to the correct outgoing port **within a LAN** (link layer), or the transfer through a router's internal **switching fabric** | **Link layer** (layer 2) within one network; or inside the router | The frame's **destination MAC address**, looked up in the **switch table** (learned by **self-learning** from source addresses) |

**One-line distinction**: routing = **planning the trip** (map → route); forwarding = **taking one interchange exit** (look up the destination in the table); switching = the **same local job at layer 2** using MAC addresses.

## 11.2 Graph model of routing
A network is a **graph G = (N, E)**: N = routers (nodes), E = links (edges) with **costs c(x, y)** (delay, distance, cost, or inverse bandwidth). **c(x, y) = ∞** if x and y are not neighbours. A **least-cost path** minimises the sum of link costs.

Two classes of algorithms:
- **Global (link-state)**: every node knows the **complete topology and all link costs** → runs **Dijkstra**.
- **Decentralised (distance-vector)**: each node knows **only its neighbours and their distance estimates**; computes iteratively → **Bellman-Ford**.

## 11.3 ★ Link-state routing and Dijkstra's algorithm
**Link state**: each router **floods** link-state advertisements (its neighbours and link costs) to **all** routers, so all have an identical map. Each router then runs **Dijkstra** locally (OSPF, IS-IS).

**Dijkstra's algorithm** (for source u):
- **D(v)**: current least-cost estimate from u to v. **p(v)**: predecessor of v on that path. **N'**: set of nodes whose least-cost path is **definitively known**.

```
Initialisation:
  N' = {u}
  for all nodes v:  if v is a neighbour of u: D(v) = c(u,v)  else D(v) = ∞
Loop (until N' = all nodes):
  find w not in N' with the minimum D(w)
  add w to N'
  for every neighbour v of w not in N':
      D(v) = min( D(v),  D(w) + c(w,v) )      ← update if the path via w is cheaper
```
- **Greedy**: always fixes the closest unfinished node. **n iterations**; complexity **O(n²)** (O(n log n + E log n) with a heap). It needs **non-negative costs**.

**Exam method**: draw a table with one row per step: **Step | N' | D(v),p(v) for each node**. Mark a node's column finished once it enters N'. Finish with the **forwarding table** (least-cost path and first hop).

### Figure 1 (Exam Q3(c), T2-2025 Q2) link costs
**x–z 8, x–y 6, x–v 3, x–w 6, y–z 12, y–v 8, y–t 7, v–t 4, v–u 3, v–w 4, t–u 2, w–u 3.**

**Adjacency (read this off Figure 1 before you start, and write it in your answer):**

| Node | Neighbours (cost) |
|---|---|
| x | z 8, y 6, v 3, w 6 |
| y | z 12, x 6, v 8, t 7 |
| z | x 8, y 12 |
| v | x 3, y 8, w 4, u 3, t 4 |
| w | x 6, v 4, u 3 |
| u | v 3, w 3, t 2 |
| t | y 7, v 4, u 2 |

### ★ Worked example DJ1: shortest paths from x (T2-2025 Q2, 8 marks)
| Step | N' | D(t),p | D(u),p | D(v),p | D(w),p | D(y),p | D(z),p |
|---|---|---|---|---|---|---|---|
| 0 | x | ∞ | ∞ | **3,x** | 6,x | 6,x | 8,x |
| 1 | xv | 7,v | **6,v** | — | 6,x | 6,x | 8,x |
| 2 | xvu | 7,v | — | — | **6,x** | 6,x | 8,x |
| 3 | xvuw | 7,v | — | — | — | **6,x** | 8,x |
| 4 | xvuwy | **7,v** | — | — | — | — | 8,x |
| 5 | xvuwyt | — | — | — | — | — | **8,x** |
| 6 | xvuwytz | — | — | — | — | — | — |

*Step-by-step reasoning*:
- Step 0: x's neighbours v 3, w 6, y 6, z 8; t and u are ∞. Minimum = **v (3)**.
- Step 1 (via v, D = 3): t = 3 + 4 = **7**; u = 3 + 3 = **6**; w: 3 + 4 = 7 > 6, keep 6; y: 3 + 8 = 11 > 6, keep. Minimum among u 6, w 6, y 6 → pick **u** (tie broken alphabetically).
- Step 2 (via u, D = 6): t: 6 + 2 = 8 > 7, keep 7; w: 6 + 3 = 9 > 6, keep. Add **w (6)**.
- Step 3 (via w): no improvements (u, v done). Add **y (6)**.
- Step 4 (via y): t: 6 + 7 = 13 > 7; z: 6 + 12 = 18 > 8. Add **t (7)**.
- Step 5: add **z (8)**.

**Result (least-cost paths from x)**:
| Destination | Cost | Path | First hop (forwarding table) |
|---|---|---|---|
| v | 3 | x → v | v |
| u | 6 | x → v → u | v |
| w | 6 | x → w | w |
| y | 6 | x → y | y |
| t | 7 | x → v → t | v |
| z | 8 | x → z | z |

### ★ Worked example DJ2: shortest paths from t (Exam Q3(c)(i), 4 marks)
| Step | N' | D(u),p | D(v),p | D(w),p | D(x),p | D(y),p | D(z),p |
|---|---|---|---|---|---|---|---|
| 0 | t | **2,t** | 4,t | ∞ | ∞ | 7,t | ∞ |
| 1 | tu | — | **4,t** | 5,u | ∞ | 7,t | ∞ |
| 2 | tuv | — | — | **5,u** | 7,v | 7,t | ∞ |
| 3 | tuvw | — | — | — | **7,v** | 7,t | ∞ |
| 4 | tuvwx | — | — | — | — | **7,t** | 15,x |
| 5 | tuvwxy | — | — | — | — | — | **15,x** |
| 6 | tuvwxyz | — | — | — | — | — | — |

*Key updates*: via u (2): w = 2 + 3 = 5; v: 2 + 3 = 5 > 4, keep. Via v (4): x = 4 + 3 = **7**; w: 4 + 4 = 8 > 5; y: 4 + 8 = 12 > 7. Via w (5): x: 5 + 6 = 11 > 7. Via x (7): z = 7 + 8 = **15**; y: 7 + 6 = 13 > 7. Via y (7): z: 7 + 12 = 19 > 15.

| Destination | Cost | Path |
|---|---|---|
| u | 2 | t → u |
| v | 4 | t → v |
| w | 5 | t → u → w |
| x | 7 | t → v → x |
| y | 7 | t → y |
| z | 15 | t → v → x → z |

### ★ Worked example DJ3: shortest paths from w (Exam Q3(c)(ii), 4 marks)
| Step | N' | D(t),p | D(u),p | D(v),p | D(x),p | D(y),p | D(z),p |
|---|---|---|---|---|---|---|---|
| 0 | w | ∞ | **3,w** | 4,w | 6,w | ∞ | ∞ |
| 1 | wu | 5,u | — | **4,w** | 6,w | ∞ | ∞ |
| 2 | wuv | **5,u** | — | — | 6,w | 12,v | ∞ |
| 3 | wuvt | — | — | — | **6,w** | 12,v | ∞ |
| 4 | wuvtx | — | — | — | — | **12,v** | 14,x |
| 5 | wuvtxy | — | — | — | — | — | **14,x** |
| 6 | wuvtxyz | — | — | — | — | — | — |

*Key updates*: via u (3): t = 3 + 2 = 5; v: 3 + 3 = 6 > 4. Via v (4): y = 4 + 8 = 12; t: 4 + 4 = 8 > 5; x: 4 + 3 = 7 > 6. Via t (5): y: 5 + 7 = 12 (equal, keep v). Via x (6): z = 6 + 8 = 14; y: 6 + 6 = 12 (equal). Via y (12): z: 12 + 12 = 24 > 14.

| Destination | Cost | Path |
|---|---|---|
| u | 3 | w → u |
| v | 4 | w → v |
| t | 5 | w → u → t |
| x | 6 | w → x |
| y | 12 | w → v → y **(tie: w → x → y and w → u → t → y also cost 12)** |
| z | 14 | w → x → z |

> **Tie note**: y has **three equal-cost paths (12)**. Any one is correct; state the tie-breaking rule you used (e.g. "keep the first-found predecessor"). Mentioning the tie shows full understanding.

### ★ Worked example DJ4: T2-2026 Q9 (A to all nodes, 10 marks)
**Link costs read from the figure**: **A–B 2, A–G 6, B–C 7, B–E 2, E–G 1, E–F 2, F–C 3, F–H 2, G–H 4, C–D 3, H–D 2.** (This is Tanenbaum's classic Dijkstra example.)

| Node | Neighbours (cost) |
|---|---|
| A | B 2, G 6 |
| B | A 2, C 7, E 2 |
| C | B 7, F 3, D 3 |
| D | C 3, H 2 |
| E | B 2, F 2, G 1 |
| F | E 2, C 3, H 2 |
| G | A 6, E 1, H 4 |
| H | G 4, F 2, D 2 |

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

*Step-by-step reasoning*:
- Step 0: neighbours of A: B 2, G 6. Pick **B (2)**.
- Step 1 (via B = 2): C = 2 + 7 = 9; E = 2 + 2 = **4**. Pick **E (4)**.
- Step 2 (via E = 4): G = 4 + 1 = **5** < 6 → update G to (5, E); F = 4 + 2 = 6. Pick **G (5)**.
- Step 3 (via G = 5): H = 5 + 4 = 9. Pick **F (6)**.
- Step 4 (via F = 6): C: 6 + 3 = 9 = 9 (**tie**, keep B); H = 6 + 2 = **8** < 9 → (8, F). Pick **H (8)**.
- Step 5 (via H = 8): D = 8 + 2 = 10. Pick **C (9)**.
- Step 6 (via C = 9): D: 9 + 3 = 12 > 10, keep. Pick **D (10)**.

**(b) Final costs and routes from A**:
| Destination | Cost | Complete shortest route |
|---|---|---|
| **B** | **2** | A → B |
| **C** | **9** | A → B → C *(equal-cost alternative: A → B → E → F → C, also 9)* |
| **D** | **10** | A → B → E → F → H → D |
| **E** | **4** | A → B → E |
| **F** | **6** | A → B → E → F |
| G | 5 | A → B → E → G (note: cheaper than the direct link A–G = 6) |
| H | 8 | A → B → E → F → H |

## 11.4 ★ Distance-vector routing and Bellman-Ford
**Bellman-Ford equation**: the least cost from x to y is
```
dₓ(y) = min over all neighbours v of { c(x,v) + dᵥ(y) }
```
**Distance-vector algorithm** (RIP): each node keeps a **distance vector Dₓ = [Dₓ(y) for all y]** and its neighbours' vectors.
1. **Initialise**: Dₓ(y) = c(x, y) for neighbours, ∞ otherwise; send Dₓ to the neighbours.
2. **Loop**: wait for a **link-cost change** or a **neighbour's new vector**; recompute Dₓ(y) = minᵥ{c(x, v) + Dᵥ(y)}; **if Dₓ changed, send it to the neighbours**.

It is **iterative** (until no more changes), **asynchronous** (no lock-step) and **distributed** (each node uses only neighbour information).

### ★ Link-state vs distance-vector (Exam Q3(a), 4 marks)
| | **Link-state (LS)** | **Distance-vector (DV)** |
|---|---|---|
| **Knowledge** | **Global**: every router has the **complete topology** | **Local**: only neighbours' cost estimates ("routing by rumour") |
| **Algorithm** | **Dijkstra** | **Bellman-Ford** |
| **What is sent, to whom** | Own **link costs**, **flooded to all** routers | Whole **distance vector**, **only to neighbours** |
| **Message complexity** | High: O(n·E) messages per change | Lower: exchanges only between neighbours |
| **Speed of convergence** | Fast: O(n²) computation, **no loops** once floods finish | **Slow**, variable; **routing loops** possible; **count-to-infinity** |
| **Robustness** | Better: each router computes its **own** table; a bad advertisement affects only its own link | Worse: a wrong cost **propagates through the whole network** |
| **Examples** | OSPF, IS-IS | RIP, (BGP is path-vector) |

**Similarities ("compare")**: both find **least-cost paths**, both produce a **forwarding table**, both are **dynamic** (adapt to cost changes) and both use **link costs**.

### ★ Essential difference: Dijkstra vs Bellman-Ford (Exam Q3(b), 4 marks)
- **Dijkstra** is a **centralised/global, greedy** algorithm: the node computing it needs the **entire graph**. It **permanently fixes one node per iteration** (the nearest unfinished node), so it finishes in **n steps**. It requires **non-negative** link costs.
- **Bellman-Ford** is **decentralised and iterative**: each node computes using **only its neighbours' current distance estimates** and **repeatedly relaxes** distances until nothing changes (at most n − 1 rounds). It **handles negative link costs** (and can detect negative cycles), is naturally **distributed**, but **converges more slowly** and can suffer count-to-infinity.
- **In one sentence**: *Dijkstra uses complete global knowledge and settles nodes greedily one at a time; Bellman-Ford uses only neighbour information and iteratively relaxes all estimates until they converge.*

## 11.5 ★ The count-to-infinity problem (Exam Q3(d), T2-2025 Q3)

**What it is**: in distance-vector routing, **bad news (a link-cost increase or failure) travels slowly**. Neighbours keep advertising **stale** routes that actually pass through the node that has just lost the route, which creates a **routing loop**. The nodes keep increasing their estimates step by step, "counting" up towards the true cost, or **towards infinity** if the destination is unreachable.

**Classic example** (Kurose & Ross): y–x cost 4, y–z 1, z–x 50. Initially D_y(x) = 4, D_z(x) = 5 (via y).
```
     x
  4 /  \ 50          The x–y link cost increases from 4 to 60.
   y ── z
     1
```
1. y sees c(y, x) = 60. y computes D_y(x) = min{60 + 0, c(y,z) + D_z(x)} = min{60, 1 + 5} = **6**. That is wrong: z's 5 is a route **through y**! Now y routes to x **via z**, and z routes to x **via y**: a **routing loop**.
2. y tells z; z updates D_z(x) = min{50, 1 + 6} = **7**.
3. z tells y; y updates to 8; z to 9; …
4. This continues for **44 iterations**, until z's estimate via y exceeds 50 and z finally chooses its direct link (50); then y = 51. Packets **loop between y and z** the whole time. If the x–y link had **failed** (cost ∞) and z had no other route, they would **count to infinity**.

**Fixes**: **poisoned reverse** (if z routes to x through y, z tells y D_z(x) = ∞; this fixes loops between **two** nodes but **not** larger loops); **split horizon**; defining **infinity as a small number** (RIP: 16 hops); hold-down timers.

**★ Will it occur if we decrease the cost of a link?** **No.** Decreasing a cost is **good news**, and **good news travels fast**. Each node that hears of the lower cost computes a lower (correct) distance through it and sends it on. Distances only **decrease** and converge within a number of iterations bounded by the network diameter. No node relies on a stale path that is now too cheap, so no loop forms. (Kurose: *"No. Decreasing link cost won't cause a loop."*)

**★ What about connecting two nodes that have no link?** **No.** Adding a new link is the same as **decreasing its cost from ∞ to a finite value**: it is good news, which propagates quickly without counting to infinity.

## 11.6 ★ Ad hoc networks (MANETs) and why routing is complicated (Exam Q2(d))
A **MANET** (mobile ad hoc network) is a collection of **mobile nodes with no fixed infrastructure** (no AP or base station). Nodes communicate directly if in range, otherwise **other nodes forward** packets (multi-hop). **Every node is also a router.** This matches your WLAN notes: in ad hoc networks *"nodes can only communicate if they can reach each other physically… or if other nodes can forward the message"*, and *"the complexity of each node is higher: implement medium access mechanisms, forwarding data"* [WL 8–9].

**Why routing in ad hoc networks is complicated**:
1. **Dynamic topology**: nodes **move**, join and leave, so links **break and form constantly**; routes go stale quickly.
2. **No infrastructure or central control**: no dedicated routers; **every node must route**, with **distributed** decisions.
3. **Limited bandwidth**: the shared wireless channel is scarce, so routing control traffic (flooding updates) competes with data.
4. **Limited battery and processing** in mobile nodes, so frequent route computation and transmission drain energy.
5. **Unreliable wireless links**: fading, interference, **hidden/exposed terminals**, high error rates, sometimes **asymmetric (unidirectional)** links.
6. **Multi-hop**: many hops, so delays and failure points multiply.
7. **Scalability and security**: large networks generate huge overhead; no trusted infrastructure, so it is vulnerable to misbehaving nodes.

## 11.7 ★ The three categories of MANET routing protocols (Exam Q2(d) 10, T2-2025 Q1 12)

| | **1. Proactive (table-driven)** | **2. Reactive (on-demand / source-initiated)** | **3. Hybrid** |
|---|---|---|---|
| **Principle** | Every node **continuously maintains routes to all destinations** in routing tables, updated by **periodic and triggered** broadcasts, whether or not routes are needed | Routes are discovered **only when a source needs one**: **route discovery** (flood a route request, the destination or an intermediate node replies) + **route maintenance** (repair broken routes) | **Combines both**: **proactive within a local zone** (nearby nodes), **reactive between zones** (distant nodes) |
| **Route availability** | **Immediately available**, so **low latency** | **Delay** while discovering the route | Fast locally; on-demand far away |
| **Overhead** | **High, constant** control traffic; wasted on unused routes; poor with high mobility | **Low** when traffic is light; but route-discovery floods are costly under heavy traffic | Balanced; tunable zone size |
| **Best for** | Small, low-mobility networks with frequent traffic | Large, highly mobile networks with occasional traffic | Large networks with mixed traffic |
| **Examples** | **DSDV** (Destination-Sequenced Distance Vector), **OLSR** (Optimized Link State Routing), WRP | **AODV** (Ad hoc On-demand Distance Vector, as used by **ZigBee** [BT-S 87]), **DSR** (Dynamic Source Routing), TORA | **ZRP** (Zone Routing Protocol) |

**AODV in brief** (your notes [BT-S 87] + standard detail): a source broadcasts a **RREQ (route request)**; intermediate nodes record the **reverse path** and rebroadcast; the destination (or a node with a fresh route) **unicasts an RREP (route reply)** back along the reverse path, which sets up forward entries; **sequence numbers** prevent loops and stale routes; **RERR** messages report broken links.

**DSDV in brief**: a table-driven distance-vector protocol (Bellman-Ford). Each entry carries a **destination sequence number** to avoid loops and count-to-infinity; full and incremental updates are broadcast periodically.

SUPPLEMENTARY: some textbooks (incl. Agrawal) name the categories **table-driven, source-initiated on-demand, and hybrid**. These are the same three. Others add **geographic/position-based** or hierarchical routing.

## 11.8 Topic 11 revision summary
- **Routing** (network-wide path, topology and costs, control plane) vs **forwarding** (router-local, destination IP + forwarding table) vs **switching** (layer 2, MAC + switch table).
- **Link-state**: flood link costs, everyone has the map, **Dijkstra** (greedy, global, O(n²), non-negative costs). **Distance-vector**: exchange vectors with neighbours, **Bellman-Ford** dₓ(y) = minᵥ{c(x,v) + dᵥ(y)}, iterative, asynchronous, distributed; slow; count-to-infinity.
- **Dijkstra answers**: from **x**: v3, u6, w6, y6, t7, z8. From **t**: u2, v4, w5, x7, y7, z15. From **w**: u3, v4, t5, x6, y12 (3-way tie), z14. **T2-2026 from A**: B2, E4, G5, F6, H8, C9 (tie), D10.
- **Count to infinity**: bad news travels slowly → loops (44 iterations in the 4/1/50 example). **Cost decrease or a new link: no** (good news travels fast). Fixes: poisoned reverse, split horizon, max hop count.
- **MANET routing is hard**: mobility, no infrastructure, bandwidth, energy, unreliable links. **Three categories: proactive (DSDV, OLSR), reactive (AODV, DSR), hybrid (ZRP).**
