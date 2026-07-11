# Code Notes #2 — How a Flashlight Explains Electricity, Binary & the Birth of Computers

> **Series:** Reading *Code* by Charles Petzold  
> **Part:** 2  
> **Description:** Learn how a simple flashlight explains electricity, batteries, voltage, current, resistance, power, and the binary foundation of modern computers.

---

# Introduction

When most people think about computers, they imagine CPUs, RAM, GPUs, or AI.

Charles Petzold takes a completely different approach.

Instead of opening a computer, he opens a **flashlight**.

At first, this sounds strange.

How can a flashlight explain a computer?

The answer is simple:

> **A computer is ultimately made from billions of tiny electrical switches, and the flashlight is the simplest electrical circuit that demonstrates how electricity works.**

Before understanding computers, we must first understand electricity.

---

# Why a Flashlight?

A flashlight is one of the simplest electrical devices found in almost every home.

It contains only a few components:

```
Battery
   │
 Switch
   │
 Bulb
   │
 Wire
```

Despite its simplicity, every modern electronic device—from calculators to supercomputers—contains these same basic ideas.

---

# What is an Electric Circuit?

The word **circuit** literally means **a complete circle or loop**.

Electricity flows only when there is a continuous path.

Closed Circuit:

```
Battery → Wire → Bulb → Wire → Battery
```

The bulb glows because electrons have a complete path to travel.

Open Circuit:

```
Battery → Wire → X → Bulb
```

Even a tiny break stops the flow of electrons.

No current.

No light.

This is exactly what a switch controls.

---

# Understanding Electricity

Electricity is often thought of as some mysterious invisible force.

In reality,

> **Electricity is simply the movement of electrons.**

Everything around us is made of atoms.

Each atom consists of:

- Protons (+)
- Neutrons (0)
- Electrons (-)

```
          Electron

             ●

      ●             ●

        Nucleus

(Protons + Neutrons)
```

Normally,

the number of electrons equals the number of protons.

This makes the atom electrically neutral.

---

# Positive and Negative Charges

Electrons carry **negative charge**.

Protons carry **positive charge**.

Nature follows one simple rule:

- Opposite charges attract.
- Like charges repel.

```
+  -   → Attract

+  +   → Repel

-  -   → Repel
```

Almost every electrical phenomenon can be explained using this rule.

---

# Static Electricity

Have you ever walked on a carpet and then touched a metal door handle?

You felt a tiny spark.

This is **static electricity**.

Here's what happens:

1. Your shoes rub against the carpet.
2. Electrons move from one material to another.
3. Your body accumulates excess electrons.
4. When you touch metal, those electrons suddenly escape.
5. The rapid movement of electrons produces a spark.

Nature always tries to restore electrical balance.

---

# Lightning: Static Electricity on a Massive Scale

Lightning follows exactly the same principle.

Clouds accumulate enormous amounts of charge.

Eventually,

the voltage becomes so large that even air can no longer resist it.

Millions of electrons suddenly move.

The result is lightning.

The spark from your finger and a lightning bolt are fundamentally the same phenomenon.

Only the scale is different.

---

# The Battery: Converting Chemistry into Electricity

Many people believe batteries "store electricity."

That is not entirely correct.

A battery stores **chemical energy**.

Chemical reactions inside the battery create an imbalance:

- One terminal gains excess electrons.
- The other terminal lacks electrons.

```
Negative Terminal

Extra Electrons

──────────────

Positive Terminal

Needs Electrons
```

When a circuit is completed,

electrons move through the external circuit,

while chemical reactions inside the battery continue to maintain this imbalance.

This is how chemical energy becomes electrical energy.

---

# Why Doesn't a Battery Drain by Itself?

A battery sitting on a table still has voltage.

However,

there is no complete path for electrons.

Therefore,

almost no current flows,

and the battery lasts a long time.

The moment a circuit is completed,

chemical reactions speed up,

and the battery begins supplying current.

---

# Conductors and Insulators

Not every material allows electrons to move equally well.

## Conductors

Materials that allow electrons to move easily.

Examples:

- Copper
- Silver
- Gold

Copper is widely used because it is inexpensive and highly conductive.

---

## Insulators

Materials that strongly resist electron movement.

Examples:

- Plastic
- Rubber
- Glass
- Dry Wood

This is why electrical wires are coated with plastic.

The current stays inside the copper wire instead of flowing into your hand.

---

# Resistance

Resistance is the opposition to current flow.

Imagine people trying to walk through a narrow crowded hallway.

The crowd slows everyone down.

Similarly,

electrons collide with atoms inside a conductor.

These collisions convert electrical energy into heat.

Resistance is measured in **Ohms (Ω)**.

---

# Voltage

Voltage is one of the most misunderstood electrical quantities.

Voltage is **not electricity**.

Voltage is the **potential** to move electrons.

Imagine lifting a brick.

On the ground,

it has little potential energy.

Lift it onto a roof,

and it gains potential energy.

Nothing is moving,

yet the potential exists.

Voltage behaves exactly the same way.

A battery sitting on a table has voltage,

even though no current is flowing.

---

# Current

Current is the actual movement of electrons.

It exists only when electrons flow.

Current is measured in **Amperes (A)**.

One ampere corresponds to approximately

```
6.24 × 10¹⁸

electrons

passing a point

every second.
```

An unimaginably large number.

---

# Ohm's Law

One of the most important equations in electricity is:

```
I = V / R
```

Where:

- I = Current
- V = Voltage
- R = Resistance

This tells us:

- Higher voltage produces more current.
- Higher resistance reduces current.

---

# Open Circuit vs Short Circuit

## Open Circuit

```
Battery

+ ------X------ -
```

Resistance is extremely high.

Current is zero.

Nothing happens.

---

## Short Circuit

```
Battery

+ ------------- -
```

Resistance is almost zero.

Current becomes extremely high.

This produces dangerous heating and can damage the battery or wires.

---

# Why Does a Bulb Glow?

Inside every incandescent bulb is an extremely thin tungsten filament.

Current passes through the filament.

Because the filament has significant resistance,

it becomes extremely hot.

At around

```
2500–3000°C
```

the tungsten glows white,

producing light.

---

# Why Tungsten?

Tungsten has one of the highest melting points among all metals.

Approximately

```
3422°C
```

Most other metals would melt before producing useful light.

---

# Why is There No Oxygen Inside the Bulb?

If oxygen were present,

the hot tungsten would burn immediately.

Therefore,

the bulb contains either

- a vacuum
- or an inert gas

to protect the filament.

---

# Electrical Power

Power measures how quickly electrical energy is converted into another form.

The equation is:

```
P = V × I
```

Where:

- P = Power (Watts)
- V = Voltage
- I = Current

Example:

Flashlight:

Voltage = 3V

Current = 0.75A

Power:

```
3 × 0.75

=

2.25 Watts
```

This means the flashlight converts **2.25 joules of energy every second**.

---

# Why Household Bulbs Have Higher Resistance

A flashlight bulb operates at only 3V.

A household bulb operates at around 120V (or 230V in many countries).

Higher voltage requires higher resistance to keep current within safe limits.

This is why household bulb filaments are designed differently.

---

# Heat Loss in Wires

Whenever current flows through resistance,

heat is produced.

The relationship is:

```
Heat ∝ I²R
```

This means:

- Double the current → Four times more heating.
- Triple the current → Nine times more heating.

This is one reason power companies transmit electricity at very high voltages—to reduce current and therefore reduce heat losses.

---

# The Most Important Component: The Switch

After explaining batteries, wires, bulbs, and electricity,

Petzold suddenly reminds us that we've forgotten the most important part:

**The Switch.**

Why?

Because a switch has only two states.

```
ON

OFF
```

Exactly like:

- Dot / Dash (Morse Code)
- Raised / Flat (Braille)

A switch naturally represents **binary information**.

---

# The Bridge to Computers

Imagine replacing one switch

with one billion tiny switches.

Each switch represents:

```
ON  = 1

OFF = 0
```

These billions of binary switches form the transistors inside every modern computer.

Everything you see on your screen—

text,

music,

images,

videos,

games,

and artificial intelligence—

is ultimately built from billions of tiny electrical switches rapidly changing between ON and OFF.

---

# Final Thoughts

This chapter teaches much more than electricity.

It teaches us that the digital world is built on remarkably simple ideas.

Electricity moves because electrons move.

Switches control that movement.

Binary represents those switch positions.

And from billions of binary switches,

the modern computer is born.

---

> **"The computer is not built upon complexity. It is built upon billions of tiny decisions: ON or OFF."**
>
> *— Inspired by Charles Petzold's* **Code**

# Code Notes #2 — 30 Important Questions & Answers
### *Revision & Interview Guide*
*Based on Chapter 4 of **Code** by Charles Petzold*

---

# 1. Why did Charles Petzold choose a flashlight to explain electricity instead of starting with computers?

**Answer:**

A flashlight is one of the simplest electrical devices. It contains the four basic components found in almost every electronic device:

- Battery
- Wires
- Switch
- Load (Bulb)

Understanding how these interact provides the foundation for understanding transistors, logic gates, and eventually computers.

---

# 2. What is an electric circuit?

**Answer:**

An electric circuit is a **closed path** that allows electrons to travel from one terminal of a power source, through electrical components, and back to the other terminal.

Without a complete loop, current cannot flow.

---

# 3. Why does current stop immediately when a switch is opened?

**Answer:**

Opening the switch breaks the circuit.

Once the path is broken,

electrons can no longer complete the loop,

so current becomes zero.

---

# 4. What actually moves inside a wire?

**Answer:**

Electrons move.

The copper atoms remain fixed in place.

Only their outer electrons slowly drift through the conductor while carrying electrical energy.

---

# 5. Does a battery create electrons?

**Answer:**

No.

A battery never creates electrons.

Electrons already exist inside the battery and wires.

The battery simply uses chemical reactions to push electrons away from one terminal and pull them toward the other, creating a voltage difference.

---

# 6. Why doesn't a battery discharge rapidly when it is not connected to anything?

**Answer:**

Because no complete circuit exists.

Without a path,

electrons cannot circulate,

so the chemical reactions proceed extremely slowly.

---

# 7. Why are all electrons considered identical?

**Answer:**

Every electron has exactly the same:

- Charge
- Mass
- Spin

There is no such thing as a copper electron or a battery electron.

This allows electricity to flow seamlessly between different materials.

---

# 8. What is static electricity?

**Answer:**

Static electricity is the accumulation of excess electric charge on an object's surface.

When that charge suddenly finds a path to another object,

a spark occurs.

---

# 9. Why do we sometimes get shocked after walking on a carpet?

**Answer:**

Friction transfers electrons between your shoes and the carpet.

Your body accumulates excess charge.

Touching a conductor suddenly equalizes the charge,

creating a spark.

---

# 10. How is lightning related to static electricity?

**Answer:**

Lightning is simply static electricity on a massive scale.

Clouds accumulate enormous charge differences.

Eventually,

the voltage becomes so large that air breaks down,

allowing billions of electrons to move at once.

---

# 11. What is a conductor?

**Answer:**

A conductor is a material whose electrons can move easily.

Examples:

- Copper
- Silver
- Gold

Conductors have very low resistance.

---

# 12. Why is copper used instead of silver in electrical wiring?

**Answer:**

Silver is a slightly better conductor,

but it is much more expensive.

Copper provides an excellent balance between conductivity, cost, strength, and durability.

---

# 13. What is an insulator?

**Answer:**

An insulator strongly resists the movement of electrons.

Examples include:

- Plastic
- Rubber
- Glass
- Dry wood

---

# 14. Why are electrical wires coated with plastic?

**Answer:**

Plastic is an insulator.

It prevents electricity from escaping the copper wire and protects people from electric shock.

---

# 15. What is electrical resistance?

**Answer:**

Resistance is the opposition offered to the flow of electric current.

Greater resistance means electrons encounter more difficulty moving through a material.

---

# 16. Why does resistance produce heat?

**Answer:**

Moving electrons collide with atoms inside the conductor.

These collisions convert electrical energy into thermal energy.

This process is called **Joule Heating**.

---

# 17. What is voltage?

**Answer:**

Voltage is the electrical potential difference between two points.

It represents the ability to push electric charge through a circuit.

Voltage can exist even when current is zero.

---

# 18. What is current?

**Answer:**

Current is the rate at which electric charge flows through a conductor.

It is measured in amperes (A).

---

# 19. State Ohm's Law.

**Answer:**

```
I = V / R
```

Current equals Voltage divided by Resistance.

---

# 20. What happens if voltage increases while resistance remains constant?

**Answer:**

Current increases proportionally.

Greater electrical pressure pushes more electrons through the circuit.

---

# 21. What happens if resistance increases while voltage remains constant?

**Answer:**

Current decreases.

Greater opposition makes it harder for electrons to move.

---

# 22. What is an open circuit?

**Answer:**

An open circuit has a break in its path.

Resistance becomes extremely high,

so no current flows.

---

# 23. What is a short circuit?

**Answer:**

A short circuit is a path with extremely low resistance.

It allows very large current to flow,

which can overheat wires, damage batteries, or start fires.

---

# 24. Why does a tungsten filament glow instead of melting immediately?

**Answer:**

Tungsten has an extremely high melting point (about 3422°C).

It can become white-hot and emit light before reaching its melting temperature.

---

# 25. Why is oxygen removed from an incandescent bulb?

**Answer:**

Hot tungsten reacts rapidly with oxygen.

Removing oxygen prevents the filament from burning.

The bulb therefore contains either a vacuum or an inert gas.

---

# 26. What is electrical power?

**Answer:**

Power is the rate at which electrical energy is converted into another form.

Examples:

- Heat
- Light
- Mechanical motion

Formula:

```
P = V × I
```

---

# 27. Why is high-voltage transmission used instead of low-voltage transmission?

**Answer:**

For the same amount of power,

higher voltage requires lower current.

Lower current greatly reduces transmission losses because

```
Heat ∝ I²R
```

---

# 28. Why is the switch considered the most important component in this chapter?

**Answer:**

Because it has only two stable states:

- ON
- OFF

These two states naturally represent binary values:

```
1

0
```

This is exactly how computers store and process information.

---

# 29. How does a flashlight relate to computers?

**Answer:**

A flashlight demonstrates the fundamental concept of a binary electrical switch.

Computers contain billions of microscopic switches called transistors,

each operating using the same ON/OFF principle.

---

# 30. What is the biggest lesson of this chapter?

**Answer:**

Modern computers appear incredibly complex,

but their foundation is remarkably simple.

Everything begins with:

- Electrons
- Electrical circuits
- Voltage
- Current
- Resistance
- Switches

A computer is ultimately nothing more than **billions of tiny electrical switches changing between ON and OFF billions of times every second.**

---

# Quick Revision Summary

| Concept | Key Idea |
|----------|----------|
| Circuit | Complete path for current |
| Electron | Carrier of electric charge |
| Battery | Converts chemical energy into electrical energy |
| Conductor | Allows electrons to move easily |
| Insulator | Prevents electron movement |
| Resistance | Opposes current |
| Voltage | Electrical pressure (potential difference) |
| Current | Flow of electrons |
| Ohm's Law | I = V / R |
| Power | P = V × I |
| Open Circuit | No current |
| Short Circuit | Very high current |
| Tungsten | High melting point, glows when heated |
| Switch | Binary ON/OFF device |
| Computer | Billions of binary electrical switches |

---

# Final Thought

> **"Every modern computer, no matter how powerful, is ultimately built upon the same simple idea demonstrated by a flashlight: control the flow of electricity using a switch. From that single binary principle emerges the entire digital world."**