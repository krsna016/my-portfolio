# Code by Charles Petzold — Deep Study Notes (Part 1)
## Chapters 1–3: Morse Code, Braille, Binary & The Nature of Codes

> **Book:** Code: The Hidden Language of Computer Hardware and Software
> **Author:** Charles Petzold

---

# Table of Contents

1. Why this book starts with Morse Code instead of Computers
2. The Central Idea of the Book
3. What is a Code?
4. Flashlight Communication Story
5. Morse Code
6. Binary Thinking
7. Combinatorics (Powers of Two)
8. Morse Tree
9. Louis Braille
10. Braille System
11. Grade 2 Braille
12. Shift Codes & Escape Codes
13. Hidden Computer Science Lessons
14. Key Takeaways
15. Memory Tricks
16. Revision Cheat Sheet

---

# 1. Why doesn't the book start with computers?

Most computer books begin like this:

```
CPU
RAM
SSD
Operating System
Programming
```

Petzold doesn't.

Instead he starts with

- Flashlights
- Morse Code
- Braille

Why?

Because he wants to teach **how information is represented**, not how computers look.

The biggest lesson of the book is:

> Computers are not magic machines.
> They are machines that transform one representation of information into another.

---

# 2. The Central Idea of the Book ⭐

Everything you've read so far revolves around one sentence:

> **Information is different from its representation.**

For example:

The word

```
CAT
```

can be represented as

```
English

CAT
```

↓

```
Morse

-.-. .- -
```

↓

```
Braille

⠉ ⠁ ⠞
```

↓

```
ASCII

67 65 84
```

↓

```
Binary

01000011
01000001
01010100
```

↓

```
Electrical Signals

HIGH LOW HIGH HIGH...
```

Notice something.

The **message never changed.**

Only the representation changed.

This is exactly what computers do.

---

# 3. What is a Code?

A code is simply

> A system for representing information.

Many people think

```
Code = Secret
```

Not true.

Most codes are NOT secret.

Examples

| Code | Represents |
|-------|------------|
| English | Ideas |
| Morse | Letters |
| Braille | Letters by touch |
| Traffic Lights | Driving Instructions |
| ASCII | Characters |
| Binary | Information |
| Programming Languages | Instructions |

Every code converts one form of information into another.

---

# 4. The Flashlight Story

Imagine

```
You               Friend

🏠                🏠
🪟--------------🪟
```

Parents say:

> Go to sleep.

But you still want to talk.

No phone.

No internet.

Only flashlights.

Now you need a communication system.

---

## First Attempt

Draw letters in the air.

Example

```
O

○
```

Didn't work.

Why?

Because movement is hard to recognize.

Lesson:

> Not every representation works well in every medium.

---

## Second Attempt

Blink counts.

```
A = 1 blink

B = 2 blinks

...

Z = 26 blinks
```

Problem:

Sending

```
HOW ARE YOU?
```

requires

```
131 blinks
```

Too slow.

---

## Discovery

Morse Code

Now

```
H = ....
```

instead of

```
8 flashes
```

Much faster.

---

# Hidden Lesson

Good codes are

- Short
- Easy
- Efficient

---

# 5. Morse Code

Morse Code has only two symbols.

```
.

Dot

-

Dash
```

Flashlight version

```
Dot

Light ON briefly

Dash

Light ON longer
```

---

## Timing Rules

This is extremely important.

| Action | Time |
|----------|------|
| Dot | 1 Unit |
| Dash | 3 Units |
| Gap inside letter | 1 Unit |
| Gap between letters | 3 Units |
| Gap between words | 7 Units |

Easy trick

```
1

↓

3

↓

7
```

Think

```
Parts

Letters

Words
```

---

## SOS

```
...

---

...
```

Actually sent as

```
...---...
```

without letter gaps.

Reason

Easy to recognize during emergencies.

---

## Why Morse is Efficient

Your blinking system

```
A = 1

Z = 26
```

Morse

```
E

.
```

Most common letter

Only one symbol.

Rare letters get longer codes.

This is the same idea modern compression algorithms use.

---

# 6. Binary Thinking

The most important sentence so far:

> Two different things can represent everything.

Examples

```
Dot

Dash
```

```
Raised

Flat
```

```
ON

OFF
```

```
0

1
```

Everything in computers is eventually reduced to

```
0

1
```

---

# 7. Combinatorics (Powers of Two)

Suppose every position has only

```
2
```

choices.

How many combinations?

| Positions | Possibilities |
|-----------|---------------|
|1|2|
|2|4|
|3|8|
|4|16|
|5|32|
|6|64|
|7|128|
|8|256|

Formula

```
Possibilities = 2ⁿ
```

where

```
n

=

Number of positions
```

---

## Example

Three switches

```
000

001

010

011

100

101

110

111
```

Total

```
8

=

2³
```

---

# Why This Matters

A computer bit also has

```
2

choices

0

or

1
```

Everything in computing is built on this idea.

---

# 8. Morse Tree

Instead of memorizing

```
A = .-

B = -...
```

Use a tree.

```
                Start

             /          \

           .            -

          E              T

       /      \       /      \

      I        A     N        M

    /  \     /  \   /  \     /  \

   S    U   R   W D    K    G    O
```

Rule

```
Left

=

Dot

Right

=

Dash
```

Example

Decode

```
.-.
```

Start

↓

Dot

↓

Dash

↓

Dot

↓

R

No memorization needed.

---

# 9. Louis Braille

Louis Braille

- Born 1809
- Lost eyesight at age 3
- Entered blind school at age 10
- Invented Braille at age 15

Amazing achievement.

---

## Before Braille

Raised English letters.

Problem

Fingers are bad at recognizing complicated shapes.

Eyes love

```
A
```

Fingers love

```
●
```

Huge difference.

---

## Charles Barbier

Invented

```
Night Writing
```

For soldiers.

Good idea

```
Raised dots.
```

Bad idea

```
Represented sounds.

Too complicated.
```

Louis Braille improved it.

---

# Engineering Lesson

Great inventions rarely appear from nothing.

Usually

```
Good Idea

↓

Improve It

↓

Simplify It

↓

World Changes
```

---

# 10. Braille

Every character fits inside

```
1 4

2 5

3 6
```

Each position

```
Raised

or

Flat
```

Exactly

```
2
```

choices.

Therefore

```
2⁶

=

64
```

possible patterns.

---

## Pattern in Alphabet

Row 1

Uses

```
1

2

4

5
```

only.

Row 2

Same patterns

+

Dot 3

Row 3

Same patterns

+

Dot 3

+

Dot 6

Beautiful design.

Not random.

---

# 11. Grade 2 Braille

Books became too large.

Solution

Use contractions.

Instead of

```
T H E
```

One symbol.

Instead of

```
A N D
```

One symbol.

Exactly like

```
BTW

LOL

ASAP
```

in texting.

---

# Number Indicator

Braille doesn't invent new digits.

Instead

```
Number Indicator
```

changes

```
A

↓

1

B

↓

2

...

J

↓

0
```

Very clever.

---

# Capital Indicator

Instead of another alphabet

Braille simply says

```
Next letter

=

Capital
```

Exactly like

```
Shift Key
```

on a keyboard.

---

# 12. Shift Codes & Escape Codes

## Shift Code

Changes interpretation until cancelled.

Example

```
Number Indicator

A

B

C

Letter Indicator

D
```

Means

```
123D
```

Everything after Number Indicator becomes numbers.

---

## Escape Code

Changes only ONE symbol.

Example

```
Capital Indicator

a

b

c
```

Means

```
Abc
```

Only first letter changes.

---

# Computer Equivalent

| Braille | Keyboard |
|----------|----------|
| Capital Indicator | Shift |
| Number Indicator | Caps Lock |
| Letter Indicator | Caps Lock OFF |

---

# 13. Biggest Computer Science Lessons

## Lesson 1

Information

≠

Representation

---

## Lesson 2

Binary systems are everywhere.

```
ON/OFF

HIGH/LOW

1/0

Raised/Flat

Dot/Dash
```

---

## Lesson 3

Context matters.

Example

Binary

```
01000001
```

Without context

Means

Nothing.

With ASCII

```
A
```

With Integer

```
65
```

With Image

```
Brightness Value
```

With CPU

```
Machine Instruction
```

Same bits.

Different interpretation.

Exactly like Braille.

---

## Lesson 4

Good codes are optimized.

Morse

Short codes

↓

Common letters.

Braille

Patterns

↓

Easy for fingers.

Computers

Binary

↓

Easy for electronics.

---

# 14. Biggest Hidden Message of These Chapters

Petzold is NOT teaching

- Morse
- Braille

He is teaching

> **Representation Theory**

Every computer performs

```
Idea

↓

Letters

↓

ASCII

↓

Binary

↓

Electric Signals

↓

CPU

↓

Binary

↓

ASCII

↓

Screen

↓

Idea
```

This is literally what happens every time you type on a keyboard.

---

# 15. Memory Tricks

## Morse

```
E

.
```

Smallest letter.

---

```
T

-
```

Tall letter

Long dash.

---

SOS

```
...---...
```

Never forget.

---

Timing

```
1

3

7
```

Parts

Letters

Words

---

Braille

```
6 Dots

↓

64 Patterns

↓

2⁶
```

---

Binary

```
Every extra bit

↓

Double possibilities.
```

---

Shift Code

Think

```
Caps Lock
```

Escape Code

Think

```
Shift Key
```

---

# 16. Final Revision Cheat Sheet

✅ Code = Representation of Information

✅ Morse = Dot + Dash

✅ Braille = Raised + Flat

✅ Computer = 0 + 1

✅ Every Binary System follows

```
2ⁿ
```

✅ Information

≠

Representation

✅ Context gives meaning.

✅ Shift Codes change interpretation until cancelled.

✅ Escape Codes change only one symbol.

✅ Morse optimizes for communication speed.

✅ Braille optimizes for touch.

✅ Computers optimize for electronics.

---

# One Sentence Summary ⭐

> **The first three chapters of _Code_ are not really about Morse code or Braille—they are about teaching you that all information can be represented using simple binary choices, and that the meaning of those binary patterns depends entirely on the rules (the code) and the context in which they are interpreted. This single idea forms the foundation of all modern computing.**


# Code by Charles Petzold — Study Guide (Part 2)
# 30 Important Questions & Answers + Concept Revision

> **Covers Chapters 1–3**
>
> Morse Code • Braille • Binary • Combinatorics • Shift Codes • Representation

---

# Section 1 — Fundamental Concepts

---

## Q1. What is a code?

### Answer

A code is a **system for representing information**.

It converts information from one form into another.

Example

```
Thought

↓

Speech

↓

Writing

↓

Morse

↓

Binary
```

The information never changes.

Only its representation changes.

---

## Q2. Is every code secret?

### Answer

No.

Most codes are **not secret**.

Examples

- English
- Braille
- Morse Code
- ASCII
- Unicode

These are public communication systems.

Only cryptographic codes are designed to hide information.

---

## Q3. Why does Petzold begin the book with Morse Code instead of computers?

### Answer

Because computers are built upon the same fundamental idea.

Before understanding computers we must understand

> Information Representation

Morse demonstrates

```
Ideas

↓

Symbols

↓

Signals
```

Computers perform exactly the same process.

---

## Q4. Why did drawing letters with a flashlight fail?

### Answer

Because flashlights are poor at representing shapes.

Movement is difficult to interpret.

```
Circle

↓

Hard to recognize
```

Instead

```
Blink

Blink

Blink
```

is much easier.

Lesson

> Good codes must fit the medium.

---

## Q5. Why was the counting-blink system inefficient?

### Answer

Example

```
A = 1 Blink

B = 2

...

Z = 26
```

Very long messages become exhausting.

Example

```
HOW ARE YOU?

131 Blinks
```

Morse reduced this dramatically.

---

# Section 2 — Morse Code

---

## Q6. What are the two symbols in Morse Code?

### Answer

```
Dot (.)

Dash (-)
```

Flashlight version

```
Short Flash

Long Flash
```

Everything is built using only these two symbols.

---

## Q7. Why is Morse Code faster?

### Answer

Common letters receive short codes.

Example

```
E

.
```

One symbol only.

Rare letters receive longer codes.

This minimizes average transmission time.

---

## Q8. What are the Morse timing rules?

### Answer

| Action | Units |
|---------|------|
| Dot | 1 |
| Dash | 3 |
| Gap inside letter | 1 |
| Gap between letters | 3 |
| Gap between words | 7 |

Memory Trick

```
1

↓

3

↓

7
```

---

## Q9. Why is SOS special?

### Answer

SOS means

```
...---...
```

It is sent continuously.

No letter gaps.

Reason

Easy to recognize during emergencies.

---

## Q10. What is the Morse Tree?

### Answer

Instead of memorizing codes alphabetically,

letters are arranged as a binary tree.

```
Left

=

Dot

Right

=

Dash
```

Decoding becomes much faster.

---

# Section 3 — Binary Thinking

---

## Q11. Why is Morse Code considered binary?

### Answer

Because every position has only two possibilities.

```
Dot

or

Dash
```

Exactly like

```
0

or

1
```

---

## Q12. What is combinatorics?

### Answer

Combinatorics studies

> How many combinations are possible?

Example

Three switches

```
000

001

010

011

100

101

110

111
```

Total

```
8

=

2³
```

---

## Q13. Why do powers of two appear everywhere?

### Answer

Because every binary position doubles possibilities.

Formula

```
Possibilities = 2ⁿ
```

Examples

| Bits | Values |
|------|--------|
|1|2|
|2|4|
|3|8|
|4|16|
|8|256|
|16|65536|

---

## Q14. Why is adding one more bit so powerful?

### Answer

Every new bit doubles possibilities.

```
3 Bits

↓

8 Values

↓

Add one bit

↓

16 Values
```

One extra bit

↓

Double information.

---

## Q15. Why is Binary ideal for computers?

### Answer

Electronics naturally support two states.

```
Voltage High

Voltage Low
```

Represented as

```
1

0
```

Simple.

Reliable.

Fast.

---

# Section 4 — Louis Braille

---

## Q16. Who was Louis Braille?

### Answer

French inventor.

Lost eyesight at age 3.

Invented Braille at age 15.

Created the world's most successful tactile writing system.

---

## Q17. Why didn't raised printed letters work well?

### Answer

Eyes recognize shapes.

Fingers recognize patterns.

Complex shapes are slow to identify.

Dots are much easier.

---

## Q18. What did Charles Barbier invent?

### Answer

Night Writing.

Designed for soldiers.

Used raised dots.

Represented sounds instead of letters.

Good for short military messages.

Poor for books.

---

## Q19. What did Louis Braille improve?

### Answer

He kept

```
Raised Dots
```

Removed

```
Sound-based encoding
```

Introduced

```
Letter-based encoding
```

Much simpler.

---

## Q20. Why was Braille revolutionary?

### Answer

Blind people could

- Read
- Write
- Take notes
- Study independently

Instead of only listening.

---

# Section 5 — Braille Structure

---

## Q21. Why are there exactly 64 Braille patterns?

### Answer

Braille contains

```
6 Dots
```

Each dot has

```
Raised

Flat
```

Two choices.

Therefore

```
2⁶

=

64
```

No more.

No less.

---

## Q22. Why is the Braille alphabet not random?

### Answer

Rows are constructed systematically.

```
Row 1

↓

Base Patterns

Row 2

↓

Base + Dot 3

Row 3

↓

Base + Dot 3 + Dot 6
```

Elegant design.

---

## Q23. What is Grade 2 Braille?

### Answer

An optimized version.

Uses contractions.

Example

```
THE

↓

One Symbol
```

Advantages

- Smaller books
- Faster reading

---

## Q24. Why reuse Braille symbols?

### Answer

There are only

```
64
```

patterns.

Instead of inventing more,

Braille changes meaning through context.

Exactly like programming languages.

---

# Section 6 — Shift & Escape Codes

---

## Q25. What is a Shift Code?

### Answer

A shift code changes interpretation

until cancelled.

Example

```
Number Indicator

A

B

C

↓

123
```

Later

```
Letter Indicator
```

returns to letters.

---

## Q26. What is an Escape Code?

### Answer

Escape affects

only the next symbol.

Example

```
Capital Indicator

a

↓

A
```

The following letters remain unchanged.

---

## Q27. Give a real-world example of Shift Code.

### Answer

Caps Lock.

```
ON

↓

Everything Uppercase
```

Until disabled.

Exactly like Braille Number Indicator.

---

## Q28. Give a real-world example of Escape Code.

### Answer

Keyboard Shift key.

```
Shift + A

↓

A
```

Only one letter changes.

Exactly like Braille Capital Indicator.

---

# Section 7 — Computer Science Connection

---

## Q29. What does this binary mean?

```
01000001
```

### Answer

Impossible to answer.

Meaning depends on context.

Could be

```
ASCII

↓

A
```

or

```
Integer

↓

65
```

or

```
Pixel Brightness
```

or

```
CPU Instruction
```

Bits themselves have no meaning.

---

## Q30. What is the single most important lesson from Chapters 1–3?

### Answer

> **Information is independent of its representation.**

Everything around us

```
Speech

Writing

Morse

Braille

Binary

Electricity
```

represents exactly the same thing

using different codes.

Computers simply perform these translations extremely quickly.

---

# Interview Questions

These are questions Petzold expects you to answer after reading these chapters.

---

### Explain why Morse Code is binary.

---

### Why are powers of two fundamental to computing?

---

### Difference between information and representation.

---

### Difference between Shift Code and Escape Code.

---

### Why are Braille patterns limited to 64?

---

### Why was Barbier's Night Writing unsuccessful?

---

### Why did Braille become successful?

---

### Why do computers use binary instead of decimal?

---

### Why is context important in binary interpretation?

---

### Explain why

```
01000001
```

has multiple meanings.

---

# Common Mistakes Beginners Make

❌ Thinking Binary itself has meaning.

Truth

```
Binary

↓

Needs Interpretation
```

---

❌ Thinking Morse invented Binary.

Truth

Morse only demonstrates binary thinking.

---

❌ Thinking Braille is random.

Truth

Braille is carefully engineered.

---

❌ Thinking Code means Secret.

Truth

Code simply means Representation.

---

❌ Thinking Computers understand English.

Truth

Computers understand electrical states.

---

# Memory Palace

Imagine entering a building.

Room 1

Flashlight

↓

Morse

↓

Communication

---

Room 2

Coin

↓

Heads

Tails

↓

Binary

---

Room 3

Tree

↓

Morse Tree

↓

Decoding

---

Room 4

Blind Student

↓

Louis Braille

↓

Raised Dots

---

Room 5

64 Switches

↓

2⁶

↓

Braille Patterns

---

Room 6

Caps Lock

↓

Shift Code

---

Room 7

Shift Key

↓

Escape Code

---

Room 8

Computer Memory

↓

01000001

↓

Different Meanings

---

# Ultimate Summary ⭐

After Chapters 1–3, you should no longer think:

```
Computers store letters.
```

Instead think

```
Computers store binary patterns.

↓

Those patterns are interpreted using agreed-upon codes.

↓

Different interpretations produce letters, numbers, pictures,
sounds, videos, or machine instructions.

↓

Information never changes.

Only representation changes.
```

---

# One-Line Summary of Chapters 1–3

> **The foundation of computer science is not programming or hardware—it is understanding how information can be represented, encoded, decoded, and interpreted using simple binary choices.**