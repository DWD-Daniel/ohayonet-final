export type ProductType = 'drug' | 'non-drug' | 'medical-device';

export interface ProductSubcategory {
  id: string;
  name: string;
  image: string;
  products: Product[];
}

export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  discount?: string;
  isNew?: boolean;
}

export interface ProductCategory {
  type: ProductType;
  label: string;
  subcategories: ProductSubcategory[];
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    type: 'drug',
    label: 'Drugs',
    subcategories: [
      {
        id: 'vitamins-supplements',
        name: 'Vitamins and Supplements',
        image: 'https://images.unsplash.com/photo-1622227922682-56c92e523e58?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        products: [
          { id: 'vm-001', name: 'Vitamin D3 1000IU', price: '$12.99', image: 'https://www.naturewise.com/cdn/shop/files/NW_-_Vitamin_D3_1_000_K2_No_Coconut_30.jpg?v=1750177473&width=600', isNew: true },
          { id: 'vm-002', name: 'Multivitamin Complex', price: '$18.50', image: 'https://potentgarden.com/cdn/shop/files/adult-multivitamin-supplement-potent-garden-potent-garden_540x.jpg?v=1743117743' },
          { id: 'vm-003', name: 'Zinc Immune Support', price: '$14.99', image: 'https://naturesfieldng.com/wp-content/uploads/2024/03/1-e1744211641240.webp', discount: '15% OFF' },
          { id: 'vm-004', name: 'Magnesium Supplement', price: '$16.99', image: 'https://images.unsplash.com/photo-1631549916768-4c192d749b23?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
          { id: 'vm-005', name: 'Omega-3 Fish Oil', price: '$22.99', image: 'https://images.unsplash.com/photo-1631549916768-4c192d749b23?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        ],
      },
      {
        id: 'antimalaria',
        name: 'Antimalaria',
        image: 'https://images.unsplash.com/photo-1707943768453-7850f916ebde?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        products: [
          { id: 'am-001', name: 'Artemether Injection', price: '$24.99', image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde0f?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
          { id: 'am-002', name: 'Quinine Oral', price: '$18.99', image: 'https://cpimg.tistatic.com/03176584/b/4/Quinine-Sulphate-Oral-Suspension.jpg', isNew: true },
          { id: 'am-003', name: 'Artesunate IV', price: '$32.99', image: 'https://5.imimg.com/data5/SELLER/Default/2022/7/ZL/YX/FN/50660068/whatsapp-image-2021-12-14-at-09-55-03-2-.jpeg', discount: '10% OFF' },
        ],
      },
      {
        id: 'pain-relievers',
        name: 'Pain Relievers',
        image: 'https://images.unsplash.com/photo-1602932213623-cc17e9541bb4?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        products: [
          { id: 'pr-001', name: 'Ibuprofen 400mg', price: '$8.99', image: 'https://images.unsplash.com/photo-1631549916768-4c192d749b23?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
          { id: 'pr-002', name: 'Paracetamol 500mg', price: '$6.99', image: 'https://medecify.com/wp-content/uploads/2025/07/IMG-215-scaled.jpeg', discount: '20% OFF' },
          { id: 'pr-003', name: 'Aspirin 100mg', price: '$7.99', image: 'https://vidafarmacias.com/6881-large_default/aspirin-protect-100-mg-box-with-28-delayed-release-tablets-acetylsalicylic-acid.jpg', isNew: true },
          { id: 'pr-004', name: 'Diclofenac 50mg', price: '$11.99', image: 'https://images.unsplash.com/photo-1631549916768-4c192d749b23?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        ],
      },
      {
        id: 'anti-asthma',
        name: 'Anti-asthma',
        image: 'https://images.unsplash.com/photo-1733751682743-8f46e457149e?q=80&w=781&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        products: [
          { id: 'aa-001', name: 'Ventolin Inhaler', price: '$28.99', image: 'https://hubnet.io/assets/medicine_images/medicine_231965060.jpg', isNew: true },
          { id: 'aa-002', name: 'Fluticasone Diskus', price: '$42.99', image: 'https://images.unsplash.com/photo-1631549916768-4c192d749b23?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
          { id: 'aa-003', name: 'Montelukast Tablet', price: '$19.99', image: 'https://hubpharmafrica.com/wp-content/uploads/2024/12/MONTELUKAST-10MG-TABLET.jpeg', discount: '12% OFF' },
        ],
      },
      {
        id: 'antibiotics',
        name: 'Antibiotics',
        image: 'https://images.unsplash.com/photo-1577401132921-cb39bb0adcff?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        products: [
          { id: 'ab-001', name: 'Amoxicillin 500mg', price: '$9.99', image: 'https://images.unsplash.com/photo-1631549916768-4c192d749b23?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
          { id: 'ab-002', name: 'Ciprofloxacin 500mg', price: '$14.99', image: 'https://images.unsplash.com/photo-1631549916768-4c192d749b23?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', discount: '8% OFF' },
          { id: 'ab-003', name: 'Erythromycin Syrup', price: '$12.99', image: 'https://images.unsplash.com/photo-1631549916768-4c192d749b23?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', isNew: true },
          { id: 'ab-004', name: 'Azithromycin 250mg', price: '$16.99', image: 'https://images.unsplash.com/photo-1631549916768-4c192d749b23?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        ],
      },
      {
        id: 'cough-cold-flu',
        name: 'Cough, Cold and Flu',
        image: 'https://images.unsplash.com/photo-1529386317747-0a2a51add902?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        products: [
          { id: 'ccf-001', name: 'Cough Syrup DXM', price: '$11.99', image: 'https://images.unsplash.com/photo-1631549916768-4c192d749b23?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', discount: '18% OFF' },
          { id: 'ccf-002', name: 'Oseltamivir (Tamiflu)', price: '$34.99', image: 'https://images.unsplash.com/photo-1631549916768-4c192d749b23?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', isNew: true },
          { id: 'ccf-003', name: 'Guaifenesin Expectorant', price: '$9.99', image: 'https://images.unsplash.com/photo-1631549916768-4c192d749b23?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        ],
      },
      {
        id: 'digestive-health',
        name: 'Digestive Health',
        image: 'https://images.unsplash.com/photo-1649073586104-2ac3fab175ea?q=80&w=737&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        products: [
          { id: 'dh-001', name: 'Omeprazole 20mg', price: '$13.99', image: 'https://images.unsplash.com/photo-1631549916768-4c192d749b23?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
          { id: 'dh-002', name: 'Antacid Chewables', price: '$7.99', image: 'https://images.unsplash.com/photo-1631549916768-4c192d749b23?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', discount: '25% OFF' },
          { id: 'dh-003', name: 'Loperamide 2mg', price: '$9.99', image: 'https://images.unsplash.com/photo-1631549916768-4c192d749b23?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', isNew: true },
          { id: 'dh-004', name: 'Probiotics Complex', price: '$22.99', image: 'https://images.unsplash.com/photo-1631549916768-4c192d749b23?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        ],
      },
      {
        id: 'eye-ear-drops',
        name: 'Eye and Ear Drops',
        image: 'https://images.unsplash.com/photo-1470162415307-7ed32bad0a5a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        products: [
          { id: 'eed-001', name: 'Artificial Tears', price: '$8.99', image: 'https://images.unsplash.com/photo-1631549916768-4c192d749b23?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', isNew: true },
          { id: 'eed-002', name: 'Antibiotic Eye Drops', price: '$12.99', image: 'https://images.unsplash.com/photo-1631549916768-4c192d749b23?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
          { id: 'eed-003', name: 'Antibiotic Ear Drops', price: '$11.99', image: 'https://images.unsplash.com/photo-1631549916768-4c192d749b23?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', discount: '10% OFF' },
        ],
      },
      {
        id: 'antihypertensives',
        name: 'Antihypertensives',
        image: 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        products: [
          { id: 'ah-001', name: 'Lisinopril 10mg', price: '$14.99', image: 'https://images.unsplash.com/photo-1631549916768-4c192d749b23?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
          { id: 'ah-002', name: 'Metoprolol 50mg', price: '$16.99', image: 'https://images.unsplash.com/photo-1631549916768-4c192d749b23?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', discount: '12% OFF' },
          { id: 'ah-003', name: 'Amlodipine 5mg', price: '$18.99', image: 'https://images.unsplash.com/photo-1631549916768-4c192d749b23?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', isNew: true },
          { id: 'ah-004', name: 'Losartan 100mg', price: '$21.99', image: 'https://images.unsplash.com/photo-1631549916768-4c192d749b23?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        ],
      },
      {
        id: 'antilipidemics',
        name: 'Antilipidemics',
        image: 'https://images.unsplash.com/photo-1542884841-9f546e727bca?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        products: [
          { id: 'al-001', name: 'Atorvastatin 20mg', price: '$19.99', image: 'https://images.unsplash.com/photo-1631549916768-4c192d749b23?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', discount: '15% OFF' },
          { id: 'al-002', name: 'Simvastatin 40mg', price: '$17.99', image: 'https://images.unsplash.com/photo-1631549916768-4c192d749b23?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', isNew: true },
          { id: 'al-003', name: 'Rosuvastatin 10mg', price: '$21.99', image: 'https://images.unsplash.com/photo-1631549916768-4c192d749b23?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        ],
      },
      {
        id: 'topicals',
        name: 'Topicals',
        image: 'https://images.unsplash.com/photo-1619798049549-a23f03c1e8d1?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        products: [
          { id: 'tp-001', name: 'Hydrocortisone Cream 1%', price: '$9.99', image: 'https://images.unsplash.com/photo-1631549916768-4c192d749b23?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
          { id: 'tp-002', name: 'Antifungal Ointment', price: '$11.99', image: 'https://images.unsplash.com/photo-1631549916768-4c192d749b23?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', discount: '20% OFF' },
          { id: 'tp-003', name: 'Antibiotic Ointment', price: '$8.99', image: 'https://images.unsplash.com/photo-1631549916768-4c192d749b23?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', isNew: true },
        ],
      },
      {
        id: 'antifungals',
        name: 'Antifungals',
        image: 'https://images.unsplash.com/photo-1609542334025-778f9093a234?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        products: [
          { id: 'af-001', name: 'Fluconazole 150mg', price: '$16.99', image: 'https://images.unsplash.com/photo-1631549916768-4c192d749b23?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
          { id: 'af-002', name: 'Clotrimazole Cream', price: '$10.99', image: 'https://images.unsplash.com/photo-1631549916768-4c192d749b23?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', discount: '15% OFF' },
          { id: 'af-003', name: 'Miconazole Powder', price: '$9.99', image: 'https://images.unsplash.com/photo-1631549916768-4c192d749b23?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', isNew: true },
        ],
      },
      {
        id: 'antidiabetics',
        name: 'Antidiabetics',
        image: 'https://images.unsplash.com/photo-1685485276219-cbdf9309be1a?q=80&w=756&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        products: [
          { id: 'ad-001', name: 'Metformin 500mg', price: '$11.99', image: 'https://images.unsplash.com/photo-1631549916768-4c192d749b23?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
          { id: 'ad-002', name: 'Glibenclamide 5mg', price: '$13.99', image: 'https://images.unsplash.com/photo-1631549916768-4c192d749b23?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', discount: '18% OFF' },
          { id: 'ad-003', name: 'Insulin Glargine', price: '$45.99', image: 'https://images.unsplash.com/photo-1631549916768-4c192d749b23?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', isNew: true },
        ],
      },
    ],
  },
  {
    type: 'non-drug',
    label: 'Non-Drugs',
    subcategories: [
      {
        id: 'first-aid-surgical',
        name: 'First Aid and Surgicals',
        image: 'https://images.unsplash.com/photo-1600091474842-83bb9c05a723?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        products: [
          { id: 'fas-001', name: 'Sterile Gauze Pads', price: '$5.99', image: 'https://cdn11.bigcommerce.com/s-1gtbylhith/images/stencil/1280x1280/products/31271/61814/hart-health-sterile-gauze-pads-4x4-non-stick__31953.1734371928.jpg?c=1', isNew: true },
          { id: 'fas-002', name: 'Medical Bandages Assorted', price: '$8.99', image: 'https://www.tonuselast.com/cache/images/3196311920/elastic-medical-bandage-ribbon-compressive-high-stretch-100-mm_430649054.jpg', discount: '22% OFF' },
          { id: 'fas-003', name: 'Surgical Gloves (100pcs)', price: '$12.99', image: 'https://images.unsplash.com/photo-1576091160399-1c84d68d6e87?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
          { id: 'fas-004', name: 'Elastic Compression Bandage', price: '$9.99', image: 'https://images.unsplash.com/photo-1576091160399-1c84d68d6e87?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
          { id: 'fas-005', name: 'Antiseptic Wipes Pack', price: '$6.99', image: 'https://images.unsplash.com/photo-1576091160399-1c84d68d6e87?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', discount: '15% OFF' },
        ],
      },
      {
        id: 'skincare',
        name: 'Skincare',
        image: 'https://images.unsplash.com/photo-1573461160327-b450ce3d8e7f?q=80&w=465&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        products: [
          { id: 'sk-001', name: 'Moisturizing Lotion 200ml', price: '$14.99', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
          { id: 'sk-002', name: 'Facial Cleanser', price: '$11.99', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', discount: '20% OFF' },
          { id: 'sk-003', name: 'Sunscreen SPF 50', price: '$18.99', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', isNew: true },
          { id: 'sk-004', name: 'Anti-aging Serum', price: '$24.99', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
          { id: 'sk-005', name: 'Lip Balm SPF 15', price: '$7.99', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', discount: '10% OFF' },
        ],
      },
    ],
  },
  {
    type: 'medical-device',
    label: 'Medical Devices',
    subcategories: [
      {
        id: 'medical-devices',
        name: 'Medical Devices',
        image: 'https://images.unsplash.com/photo-1685485276914-6cefc2417c05?q=80&w=756&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        products: [
          { id: 'md-001', name: 'Digital Thermometer', price: '$12.99', image: 'https://mytrinityhospital.com/wp-content/uploads/2020/12/electronic-infrared-thermometer-3.jpg' },
          { id: 'md-002', name: 'Blood Pressure Monitor', price: '$39.99', image: 'https://precious-pharmacy.com/cdn/shop/products/Artboard52_4576556c-8859-410f-98cb-0d026115d782.png?v=1597154381', discount: '12% OFF' },
          { id: 'md-003', name: 'Glucometer Kit', price: '$28.99', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', isNew: true },
          { id: 'md-004', name: 'Pulse Oximeter', price: '$34.99', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
          { id: 'md-005', name: 'Nebulizer Machine', price: '$59.99', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', discount: '18% OFF' },
          { id: 'md-006', name: 'Heating Pad', price: '$22.99', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        ],
      },
    ],
  },
];

export function getAllProducts(type?: ProductType): Product[] {
  const products: Product[] = [];
  const categories = type
    ? PRODUCT_CATEGORIES.filter((cat) => cat.type === type)
    : PRODUCT_CATEGORIES;

  categories.forEach((category) => {
    category.subcategories.forEach((subcategory) => {
      products.push(...subcategory.products);
    });
  });

  return products;
}

export function getNewArrivals(): Product[] {
  return getAllProducts().filter((p) => p.isNew).slice(0, 4);
}

export function getDiscountedProducts(): Product[] {
  return getAllProducts().filter((p) => p.discount).slice(0, 4);
}
