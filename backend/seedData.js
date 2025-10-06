const PDF = require('./models/PDF');

const seedNCERTPDFs = async () => {
    try {
        // Check if NCERT PDFs already exist
        const existingNCERT = await PDF.findOne({ isNCERT: true });
        if (existingNCERT) {
            console.log('NCERT PDFs already seeded');
            return;
        }

        // Sample NCERT Physics Class XI chapters
        const ncertPDFs = [
            {
                filename: 'ncert-physics-class11-ch1.pdf',
                originalName: 'NCERT Physics Class XI - Chapter 1: Physical World',
                filepath: '/sample/ncert-physics-ch1.pdf',
                content: `Chapter 1: Physical World

The Physical World is a fascinating place to explore. Physics is the most fundamental of all sciences which attempts to describe the whole nature in terms of simple fundamental laws.

What is Physics?
Physics is the study of matter, energy and their interactions. It seeks to understand how the universe behaves at a fundamental level.

Scope and Excitement of Physics:
Physics covers a tremendous range of phenomena. From the smallest particles to the largest galaxies, physics helps us understand the natural world.

Fundamental Forces in Nature:
1. Gravitational Force
2. Electromagnetic Force  
3. Strong Nuclear Force
4. Weak Nuclear Force

Physics, Technology and Society:
Physics has played a crucial role in the development of technology and has significantly impacted society.

Key Concepts:
- Motion and its laws
- Energy and its conservation
- Matter and its properties
- Forces and their effects`,
                chunks: [
                    {
                        text: "The Physical World is a fascinating place to explore. Physics is the most fundamental of all sciences which attempts to describe the whole nature in terms of simple fundamental laws.",
                        pageNumber: 1,
                        chunkIndex: 0
                    },
                    {
                        text: "Physics is the study of matter, energy and their interactions. It seeks to understand how the universe behaves at a fundamental level.",
                        pageNumber: 1,
                        chunkIndex: 1
                    },
                    {
                        text: "Fundamental Forces in Nature: 1. Gravitational Force 2. Electromagnetic Force 3. Strong Nuclear Force 4. Weak Nuclear Force",
                        pageNumber: 2,
                        chunkIndex: 2
                    }
                ],
                isNCERT: true
            },
            {
                filename: 'ncert-physics-class11-ch2.pdf',
                originalName: 'NCERT Physics Class XI - Chapter 2: Units and Measurements',
                filepath: '/sample/ncert-physics-ch2.pdf',
                content: `Chapter 2: Units and Measurements

Measurement is fundamental to all experimental sciences. In this chapter, we will learn about the importance of measurements in physics.

The International System of Units (SI):
The SI system is based on seven fundamental units:
1. Length (metre, m)
2. Mass (kilogram, kg)
3. Time (second, s)
4. Electric current (ampere, A)
5. Temperature (kelvin, K)
6. Amount of substance (mole, mol)
7. Luminous intensity (candela, cd)

Measurement of Length:
- For very small lengths: Vernier callipers, screw gauge
- For moderate lengths: Metre scale
- For large distances: Triangulation method

Measurement of Mass:
- Common balance for moderate masses
- Physical balance for precise measurements
- Spring balance for approximate measurements

Significant Figures:
Rules for significant figures help in expressing measurements accurately.

Dimensional Analysis:
Every physical quantity can be expressed in terms of fundamental dimensions.`,
                chunks: [
                    {
                        text: "Measurement is fundamental to all experimental sciences. In this chapter, we will learn about the importance of measurements in physics.",
                        pageNumber: 1,
                        chunkIndex: 0
                    },
                    {
                        text: "The SI system is based on seven fundamental units: Length (metre), Mass (kilogram), Time (second), Electric current (ampere), Temperature (kelvin), Amount of substance (mole), Luminous intensity (candela)",
                        pageNumber: 1,
                        chunkIndex: 1
                    },
                    {
                        text: "Dimensional Analysis: Every physical quantity can be expressed in terms of fundamental dimensions.",
                        pageNumber: 3,
                        chunkIndex: 2
                    }
                ],
                isNCERT: true
            },
            {
                filename: 'ncert-physics-class11-ch3.pdf',
                originalName: 'NCERT Physics Class XI - Chapter 3: Motion in a Straight Line',
                filepath: '/sample/ncert-physics-ch3.pdf',
                content: `Chapter 3: Motion in a Straight Line

Motion is one of the most common phenomena in the universe. In this chapter, we study the simplest type of motion - motion in a straight line.

Position and Displacement:
- Position of an object is its location with respect to a chosen reference point
- Displacement is the change in position of an object

Velocity and Speed:
- Speed is the rate of change of distance
- Velocity is the rate of change of displacement
- Average velocity = Total displacement / Total time

Acceleration:
- Acceleration is the rate of change of velocity
- Average acceleration = Change in velocity / Time taken

Equations of Motion:
For uniformly accelerated motion:
1. v = u + at
2. s = ut + (1/2)at²
3. v² = u² + 2as

Where: u = initial velocity, v = final velocity, a = acceleration, t = time, s = displacement`,
                chunks: [
                    {
                        text: "Motion is one of the most common phenomena in the universe. In this chapter, we study the simplest type of motion - motion in a straight line.",
                        pageNumber: 1,
                        chunkIndex: 0
                    },
                    {
                        text: "Position of an object is its location with respect to a chosen reference point. Displacement is the change in position of an object.",
                        pageNumber: 1,
                        chunkIndex: 1
                    },
                    {
                        text: "Equations of Motion for uniformly accelerated motion: v = u + at, s = ut + (1/2)at², v² = u² + 2as",
                        pageNumber: 3,
                        chunkIndex: 2
                    }
                ],
                isNCERT: true
            }
        ];

        await PDF.insertMany(ncertPDFs);
        console.log('NCERT PDFs seeded successfully');
    } catch (error) {
        console.error('Error seeding NCERT PDFs:', error);
    }
};

module.exports = seedNCERTPDFs;
