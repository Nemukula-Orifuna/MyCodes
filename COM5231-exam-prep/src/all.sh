#!/bin/bash
set -e
B=/tmp/claude-0/-home-user-MyCodes/0fa15150-1f26-5beb-afea-c5325c6ac56e/scratchpad/build
D=/home/user/MyCodes/COM5231-exam-prep
cd $D
b(){ python3 -I $B/build.py "$@" >/dev/null; }
b "$D/COM5231_Complete_Exam_Prep.pdf" "Complete Exam Preparation Pack" "Overview · Study Notes (Topics 1–11) · Exam Pattern Analysis · Answers to All Past Papers · Practice Questions · Revision Guide" src/Part0_Overview.md src/Part1_Study_Notes_Topics_1-4.md src/Part2_Study_Notes_Topics_5-8.md src/Part3_Study_Notes_Topics_9-11.md src/Part4_Exam_Pattern_Analysis.md src/Part5_Answers_Exam_and_Test1A.md src/Part6_Answers_Tests_and_Exercises.md src/Part7_Practice_Questions.md src/Part8_Revision_Guide.md
b "$D/individual_parts/Part1_Study_Notes_Topics_1-4.pdf" "Part 1 — Study Notes" "Overview · Transmission Fundamentals · Wireless Channel · Channel Correction · Signal Encoding" src/Part0_Overview.md src/Part1_Study_Notes_Topics_1-4.md
b "$D/individual_parts/Part2_Study_Notes_Topics_5-8.pdf" "Part 2 — Study Notes" "Multiple Access · Spread Spectrum · OFDM/OFDMA · Error Detection and Correction" src/Part2_Study_Notes_Topics_5-8.md
b "$D/individual_parts/Part3_Study_Notes_Topics_9-11.pdf" "Part 3 — Study Notes" "Wireless LANs · Bluetooth/802.15/ZigBee · Routing and MANETs" src/Part3_Study_Notes_Topics_9-11.md
b "$D/individual_parts/Part4_Exam_Pattern_Analysis.pdf" "Part 4 — Exam Pattern Analysis" "All five past papers analysed" src/Part4_Exam_Pattern_Analysis.md
b "$D/individual_parts/Part5_Answers_Exam_and_Test1A.pdf" "Part 5 — Model Answers" "Exam Paper · Test 1 (Version A)" src/Part5_Answers_Exam_and_Test1A.md
b "$D/individual_parts/Part6_Answers_Tests_and_Exercises.pdf" "Part 6 — Model Answers" "Test 1B · Test 2 2025 · Test 2 2026 · Bluetooth Exercises · Error-Detection Worksheet" src/Part6_Answers_Tests_and_Exercises.md
b "$D/individual_parts/Part7_Practice_Questions.pdf" "Part 7 — Practice Questions" "Generated practice questions with model answers" src/Part7_Practice_Questions.md
b "$D/individual_parts/Part8_Revision_Guide.pdf" "Part 8 — Revision Guide" "Priorities · Definitions · Formulas · Repeated Questions · Mistakes · Strategy · Checklist" src/Part8_Revision_Guide.md
for f in COM5231_Complete_Exam_Prep.pdf individual_parts/*.pdf; do echo "$(pdfinfo "$f" | awk '/Pages/{print $2}') pages  $f"; done
