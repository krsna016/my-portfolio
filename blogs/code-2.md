# Code Book Notes #2 — Understanding Electricity Through a Flashlight
### *From Atoms to Binary Circuits*  
*Based on Chapters 4 of **Code** by Charles Petzold*

---

# Introduction

If someone asked,

> **"How does a computer work?"**

most people would probably answer,

> "It runs on electricity."

That's true—but it doesn't really explain anything.

Charles Petzold starts much deeper.

Instead of beginning with CPUs or transistors, he begins with something every child has used:

> **A flashlight.**

At first this seems strange.

How can a flashlight explain a modern computer?

As it turns out, **almost everything inside a computer is nothing more than billions of tiny electrical switches**, and a flashlight is the simplest circuit that demonstrates how electricity behaves.

This chapter teaches us not just electricity, but also why computers use **binary (ON/OFF)** states.

---

# Anatomy of a Flashlight

A simple flashlight contains only a few parts.

```
Battery
   │
 Switch
   │
 Bulb
   │
 Back to Battery
```

Every part has a specific purpose.

| Component | Purpose |
|-----------|---------|
| Battery | Provides electrical energy |
| Wire | Carries electrons |
| Switch | Opens or closes the circuit |
| Bulb | Converts electrical energy into light |

Although this seems simple, these four components are enough to explain the foundation of all electronics.

---

# What is an Electric Circuit?

A circuit literally means **a complete circle**.

Electricity flows only when there is a complete path.

Closed circuit:

```
Battery → Wire → Bulb → Wire → Battery
```

Bulb glows.

Open circuit:

```
Battery → Wire → X → Bulb
```

One tiny break.

No current flows.

Bulb stays off.

A switch simply creates or removes this break.

---

# Why Does Electricity Need a Closed Path?

Imagine water flowing in a circular pipe.

```
Pump
 │
 ▼
Pipe → Pipe → Pipe
 ▲             │
 └─────────────┘
```

If the pipe is cut,

water stops.

Electricity behaves similarly.

Electrons must have a complete loop.

No loop.

No current.

---

# What is Electricity?

Electricity is **the movement of electrons.**

Everything around us is made from atoms.

An atom contains

```
          Electron

             ●

      ●             ●

         Nucleus

     Protons + Neutrons
```

Atoms normally contain

- equal number of protons (+)
- equal number of electrons (-)

This balance keeps matter electrically neutral.

---

# Positive and Negative Charges

Electrons carry **negative charge**.

Protons carry **positive charge**.

Opposite charges attract.

Like charges repel.

```
+     -     → Attract

-     -     → Repel

+     +     → Repel
```

This simple rule explains almost every electrical phenomenon.

---

# Static Electricity

Have you ever touched a metal doorknob and felt a tiny shock?

That is static electricity.

Example:

Walking on carpet.

↓

Shoes rub against carpet.

↓

Electrons move.

↓

Your body accumulates excess electrons.

↓

Touch metal.

↓

Electrons suddenly escape.

↓

Spark.

This happens because nature always tries to restore electrical balance.

---

# Lightning is Giant Static Electricity

Clouds accumulate enormous amounts of charge.

Eventually,

the voltage becomes so high that air itself becomes conductive.

Millions of electrons suddenly move.

We call this

> **Lightning**

The tiny spark from your finger and a lightning bolt follow exactly the same principle.

The only difference is scale.

---

# The Role of the Battery

A battery does **not create electrons.**

This is one of the biggest misconceptions.

Instead,

chemical reactions inside the battery

push electrons from one terminal

and pull electrons toward the other.

```
Negative Terminal

Extra Electrons

──────────────

Positive Terminal

Needs Electrons
```

The battery creates an electrical imbalance.

Nature tries to correct that imbalance.

Current flows.

---

# Why Doesn't a Battery Discharge by Itself?

Suppose a battery is lying on a table.

```
+          -

Nothing Connected
```

No complete circuit.

No significant current.

Therefore,

chemical reactions occur extremely slowly.

The battery lasts for months.

Once we connect a wire,

the reactions speed up dramatically.

---

# Electrons Are Universal

One beautiful insight from Petzold is:

> **An electron is an electron.**

There is no

- copper electron
- battery electron
- wire electron

Every electron in the universe is identical.

This allows electrons inside the battery to seamlessly become electrons inside the wire.

---

# Conductors and Insulators

Not every material carries electricity equally well.

## Conductors

These allow electrons to move easily.

Examples:

- Copper
- Silver
- Gold

Copper is the most commonly used because it is inexpensive and conducts electricity extremely well.

---

## Insulators

These resist the movement of electrons.

Examples:

- Rubber
- Plastic
- Glass
- Dry wood

That is why electrical wires are coated with plastic.

The electricity stays inside the copper wire.

---

# Resistance

Resistance means

> **Opposition to current flow.**

Imagine a crowded hallway.

People try to walk.

Crowding slows them down.

Electricity behaves similarly.

Electrons collide with atoms.

These collisions convert electrical energy into heat.

---

# Voltage

Voltage is often misunderstood.

Voltage is **not current.**

Voltage is

> **Electrical potential**.

Think of a brick.

```
Ground

↓

No potential
```

Lift it to the roof.

```
Roof

↓

High potential
```

The brick hasn't moved.

Yet it now has more potential energy.

Voltage is exactly like that.

A battery sitting on a table has voltage

even though no current is flowing.

---

# Current

Current is

> **The flow of electrons.**

Current exists only when electrons actually move.

Unit:

Ampere (A)

One ampere equals approximately

```
6.24 × 10¹⁸

electrons

every second
```

An astonishing number.

---

# Resistance, Voltage and Current

These three quantities are connected by

## Ohm's Law

```
I = V / R
```

Where

- I → Current
- V → Voltage
- R → Resistance

Increasing voltage increases current.

Increasing resistance decreases current.

---

# Open Circuit

```
Battery

+ --------X--------- -
```

Resistance

Very High

Current

Zero

---

# Short Circuit

```
Battery

+ ------------------ -
```

Resistance

Almost Zero

Current

Very High

This produces excessive heat.

Short circuits are dangerous.

---

# Why Does a Bulb Glow?

Inside a bulb is an extremely thin tungsten filament.

```
Current

↓

Thin Tungsten Wire

↓

Heat

↓

Light
```

The filament has enough resistance to become extremely hot.

Around

```
2500–3000°C
```

It glows white.

---

# Why Tungsten?

Tungsten has one of the highest melting points of any metal.

Approximately

```
3422°C
```

Other metals would melt.

Tungsten glows instead.

---

# Why is the Bulb a Vacuum?

Hot tungsten reacts with oxygen.

If oxygen were present,

the filament would burn.

Therefore,

the bulb contains

- vacuum
- or inert gas

This prevents combustion.

---

# Power

Power tells us

> **How fast energy is being converted.**

Formula

```
P = V × I
```

Power is measured in

Watts (W).

Example

Flashlight

```
Voltage

3 V

Current

0.75 A
```

Power

```
3 × 0.75

=

2.25 W
```

Meaning

The bulb converts

2.25 joules of energy every second.

---

# Why Home Bulbs Have Larger Resistance

Flashlight

```
3V

4Ω
```

House

```
120V

144Ω
```

Higher voltage requires higher resistance

to keep current under control.

---

# Heat Loss

Electrical heating follows

```
Heat ∝ I²R
```

Current doubles.

Heat becomes four times larger.

Current triples.

Heat becomes nine times larger.

This is why engineers try to reduce current in transmission lines.

---

# The Most Important Component

Petzold suddenly says

> "We've forgotten the most important part."

The answer is

**The Switch.**

Why?

Because

the switch has only

```
ON

OFF
```

Two states.

Exactly like

- Dot / Dash
- Raised / Flat
- Yes / No

This is

**Binary.**

---

# The Beginning of Computers

Imagine replacing one switch

with

one billion switches.

Each switch stores

```
ON = 1

OFF = 0
```

Every image,

song,

movie,

game,

website,

and AI conversation

is ultimately built

from billions of these tiny electrical switches.

This is the bridge between

Electricity

↓

Binary

↓

Computers.

---

# Key Takeaways

- Electricity is the movement of electrons.
- A circuit must be closed for current to flow.
- Batteries create electrical potential using chemical reactions.
- Conductors allow electrons to move easily.
- Insulators resist electron movement.
- Resistance converts electrical energy into heat.
- Voltage is electrical potential.
- Current is moving charge.
- Ohm's Law connects voltage, current, and resistance.
- A bulb glows because its tungsten filament becomes extremely hot.
- A switch has only two states: ON and OFF.
- Binary electrical switches form the foundation of modern computers.

---

# Revision Questions (30)

### 1. What is electricity?

Movement of electrons.

---

### 2. What is an electric circuit?

A complete closed path for current.

---

### 3. Why does current stop in an open circuit?

Because the loop is broken.

---

### 4. What is static electricity?

Sudden movement of excess electrons.

---

### 5. Why do we feel a spark?

Charge imbalance suddenly equalizes.

---

### 6. Why is lightning similar to static electricity?

Both involve rapid movement of electrons.

---

### 7. Does a battery create electrons?

No.

It moves existing electrons using chemical reactions.

---

### 8. Why doesn't an unused battery discharge quickly?

No complete circuit exists.

---

### 9. What is a conductor?

Material that allows electrons to move easily.

---

### 10. Name three good conductors.

Copper, Silver, Gold.

---

### 11. What is an insulator?

Material that strongly resists current.

---

### 12. Why are wires coated with plastic?

Plastic is an insulator.

---

### 13. What is resistance?

Opposition to current flow.

---

### 14. What causes resistance?

Electron collisions with atoms.

---

### 15. What is voltage?

Electrical potential difference.

---

### 16. Can voltage exist without current?

Yes.

Example: battery lying on a table.

---

### 17. What is current?

Flow of electric charge.

---

### 18. What is the SI unit of current?

Ampere.

---

### 19. State Ohm's Law.

I = V / R

---

### 20. What happens if voltage increases while resistance stays constant?

Current increases.

---

### 21. What happens if resistance increases while voltage stays constant?

Current decreases.

---

### 22. What is a short circuit?

A path with extremely low resistance.

---

### 23. Why is a short circuit dangerous?

It causes very high current and heating.

---

### 24. Why does a bulb glow?

Its filament becomes extremely hot.

---

### 25. Why is tungsten used?

It has a very high melting point.

---

### 26. Why is there vacuum inside a bulb?

To prevent tungsten from burning.

---

### 27. What is electrical power?

Rate of energy conversion.

---

### 28. State the power formula.

P = VI

---

### 29. Why is a switch important?

It controls current using only two states.

---

### 30. Why is a flashlight important in understanding computers?

Because its ON/OFF switch demonstrates binary logic, the same principle used by billions of transistors inside every modern computer.

---

> **"A computer is not born from complexity. It is born from a simple switch that can only say one of two things: ON or OFF." — Inspired by Charles Petzold**