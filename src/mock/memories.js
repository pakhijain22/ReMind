// Field names match Backend API_CONTRACT.md Section 11 (GET /patients/:id/memories)
// exactly. `photo` holds either a base64 string (real backend) or, for this
// mock/demo stage, a plain image URL — both work fine as an <img src>.
export const mockMemories = [
  {
    id: '1',
    title: 'Diwali celebration',
    photo: 'https://placehold.co/400x300/0F5257/FAF8F3?text=Family+Photo',
    note: 'Diwali celebration with grandchildren, 2019',
    createdAt: '2019-11-04T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'Wedding anniversary',
    photo: 'https://placehold.co/400x300/E8A33D/1B2E2E?text=Wedding+Day',
    note: 'Our wedding anniversary trip to Shillong',
    createdAt: '2015-06-12T00:00:00.000Z',
  },
  {
    id: '3',
    title: 'Planting the mango tree',
    photo: 'https://placehold.co/400x300/3E7C59/FAF8F3?text=Garden',
    note: 'Planting the mango tree in the backyard',
    createdAt: '2020-07-20T00:00:00.000Z',
  },
]
