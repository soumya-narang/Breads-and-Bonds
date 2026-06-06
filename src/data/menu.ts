export type MenuItem = {
  id: string;
  name: string;
  price: number;
  description?: string; // Added description for bestsellers
};

export const menuData = {
  bestsellers: [
    { id: 'bs1', name: 'Whole-Wheat Chocochips Cake', description: 'Our signature whole-wheat base loaded with premium dark choco chips.', price: 550 },
    { id: 'bs2', name: 'Marble Cake', description: 'A beautiful swirl of vanilla and rich cocoa in a classic sponge.', price: 480 },
    { id: 'bs3', name: 'Tooty-Fruity Cake', description: 'Nostalgic vanilla cake studded with candied fruits and nuts.', price: 450 },
    { id: 'bs4', name: 'Classic Chocolate Cake', description: 'Deep, rich cocoa sponge with a perfect crumb.', price: 500 },
    { id: 'bs5', name: 'Dates & Walnuts Cake', description: 'Naturally sweetened with premium dates and packed with plain walnuts.', price: 600 },
    { id: 'bs6', name: 'Vanilla Cake', description: 'A light, classic refined flour sponge with the pure essence of vanilla.', price: 400 },
  ],
  bases: [
    { id: 'b1', name: 'Maida/Refined Flour', price: 230 },
    { id: 'b2', name: 'Whole Wheat', price: 250 },
    { id: 'b3', name: 'Ragi/Oats', price: 270 },
  ],
  flavours: [
    { id: 'f1', name: 'Vanilla/Tooty Fruity', price: 20 },
    { id: 'f2', name: 'Butterscotch', price: 20 },
    { id: 'f3', name: 'Coffee', price: 20 },
    { id: 'f4', name: 'Pineapple', price: 20 },
    { id: 'f5', name: 'Chocolate', price: 40 },
  ],
  sweeteners: [
    { id: 's1', name: 'White Sugar', price: 20 },
    { id: 's2', name: 'Brown Sugar', price: 35 },
    { id: 's3', name: 'Jaggery', price: 30 },
    { id: 's4', name: 'Dates', price: 45 },
  ],
  additionals: [
    { id: 'a1', name: 'Ganache', price: 70 },
    { id: 'a2', name: 'Almonds', price: 40 },
    { id: 'a3', name: 'Walnuts', price: 50 },
    { id: 'a4', name: 'Cashew', price: 40 },
    { id: 'a5', name: 'Choco Chips', price: 50 },
    { id: 'a6', name: 'Dry Fruit Mix', price: 60 },
  ]
};
