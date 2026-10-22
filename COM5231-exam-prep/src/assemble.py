import re
p5=open('Part5_Answers_Exam_and_Test1A.md').read(); p6=open('Part6_Answers_Tests_and_Exercises.md').read()
def block(text,start,end):
    a=text.index(start); b=text.index(end,a) if end else len(text); return text[a:b]
exam=block(p5,'# EXAM PAPER','# TEST 1, VERSION A'); t1a=block(p5,'# TEST 1, VERSION A',None)
t1b=block(p6,'# COM5231 TEST 1, VERSION B','# TEST 2 2025'); t25=block(p6,'# TEST 2 2025','# COM5231 TEST 2 2026'); t26=block(p6,'# COM5231 TEST 2 2026','# BLUETOOTH EXERCISES')
def secs(text):
    parts=re.split(r'(?m)^(### .*)$',text); d={}
    for i in range(1,len(parts),2):
        h=parts[i]; body=parts[i+1]
        body=re.split(r'(?m)^(?:## |# |---[ \t]*$)',body)[0].strip()
        key=re.match(r'### (Q\d+|\d\([a-e]\))',h).group(1); d[key]=(h,body)
    return d
E,A,Bq,C,D=secs(exam),secs(t1a),secs(t1b),secs(t25),secs(t26)
def body(d,k): return d[k][1]
def rest(b): return b.split('\n',1)[1].strip() if '\n' in b else ''
A['Q3']=(A['Q3'][0], body(E,'1(a)')+'\n\n**Additional points for full marks:**\n\n'+rest(body(A,'Q3')))
A['Q5']=(A['Q5'][0], body(E,'1(c)')+'\n\n**Additional detail:**\n\n'+rest(body(A,'Q5')))
A['Q6']=(A['Q6'][0], body(E,'1(d)'))
A['Q8']=(A['Q8'][0], body(E,'5(b)'))
A['Q9']=(A['Q9'][0], body(E,'5(c)'))
A['Q10']=(A['Q10'][0], rest(body(A,'Q10')))
A['Q11']=(A['Q11'][0], body(E,'5(e)'))
Bq['Q3']=(Bq['Q3'][0], body(A,'Q1'))
Bq['Q4']=(Bq['Q4'][0], body(A,'Q3'))
Bq['Q6']=(Bq['Q6'][0], body(A,'Q4'))
Bq['Q7']=(Bq['Q7'][0], rest(body(Bq,'Q7')))
C['Q1']=(C['Q1'][0], body(E,'2(d)')+'\n\n**Additional detail for 12 marks:**\n\n'+rest(body(C,'Q1')))
first3d=body(E,'3(d)').split('\n\n')[0]
C['Q3']=(C['Q3'][0], first3d+'\n\n'+rest(body(C,'Q3')))
tbl="""| Aspect | **Wired LAN** | **Wireless LAN** |
|---|---|---|
| Medium | Wires; dedicated/switched links | **Air**; the signal is **broadcast** and **shared** by all hosts |
| Hosts | Fixed attachment point | **Not physically connected**; can **move freely** |
| Isolated LAN | Hosts joined by a link-layer **switch** | **Ad hoc network**: hosts communicate directly, **no AP** |
| Connection to other networks | Via a **router** | Via an **access point** that joins the wireless and wired environments |
| Moving between them | Change the NICs and replace the switch with an AP: **MAC addresses change, IP addresses stay the same** | |
| Access method | **CSMA/CD** | **CSMA/CA** |
| Channel | Negligible attenuation and interference | **Attenuation, interference, multipath, higher error rate** |"""
b5=body(C,'Q5')
b5=re.sub(r'use the wired-vs-wireless table in Part 3 §9\.3 \[FZ\]\..*?Also from \[WL 3\]:', '\n\n'+tbl+'\n\nAlso from [WL 3]:', b5, flags=re.S)
C['Q5']=(C['Q5'][0], b5)
C['Q6']=(C['Q6'][0], body(A,'Q12'))
C['Q7']=(C['Q7'][0], rest(body(C,'Q7')))
C['Q8']=(C['Q8'][0], rest(body(C,'Q8')))
extra=body(C,'Q9').split('plus one more mark: ',1)[1]
C['Q9']=(C['Q9'][0], body(E,'4(d)')+'\n\nAlso: '+extra)
C['Q10']=(C['Q10'][0], rest(body(C,'Q10')))
def emit(title,d,keys):
    out=[f'# {title}\n']
    for k in keys: out.append(d[k][0]+'\n\n'+d[k][1]+'\n')
    return '\n'.join(out)
intro=open('Photographed_Papers_Answers.md').read().split('# COM5231 Test 2 2026')[0]
doc=intro+emit('COM5231 Test 2 2026 (50 marks)',D,list(D))+'\n'+emit('Test 1 — Version A (14 questions)',A,list(A))+'\n'+emit('COM5231 Test 1 — Version B (100 marks)',Bq,list(Bq))+'\n'+emit('Test 2 2025 (100 marks)',C,list(C))+'\n'+emit('Exam Paper, Page 4 — Question 4(e) and Question 5',E,['4(e)','5(a)','5(b)','5(c)','5(d)','5(e)'])
doc=re.sub(r'\s*\(Part [0-9]\)','',doc)
L=doc.split('\n'); out=[]; infence=False
for l in L:
    if l.startswith('```'): infence=not infence
    if not infence and l.startswith('|') and out and out[-1].strip() and not out[-1].startswith('|'): out.append('')
    out.append(l)
open('Photographed_Papers_Answers.md','w').write('\n'.join(out))
print('fences', '\n'.join(out).count('```'))
