export let customerDB = [
    {id: "C001", name: "Kamal Perera", address: "Colombo", phone: "0712345678", email: "kasun@gmail.com", note: "VIP Customer"},
    {id: "C002", name: "Nimali Silva", address: "Panadura", phone: "0778901234", email: "nimali@live.com", note: "Best Customer"},
    {id: "C003", name: "Sunil Shantha", address: "Kandy", phone: "0755566778", email: "sunil@outlook.com", note: " "},
    {id: "C004", name: "Kamal Gunaratne", address: "Main Street, Matara", phone: "0723344556", email: "kamal.g@yahoo.com", note: " "},
    {id: "C005", name: "piyumali De Silva", address: "Ambalangoda", phone: "0781122334", email: "piumi@gmail.com", note: "VIP Customer"},
    {id: "C006", name: "Jinuka Ashen", address: "Hiriketuya Road, Ambalangoda", phone: "0704455667", email: "ruwan@company.lk", note: " "},
    {id: "C007", name: "Dilini Fernando", address: "Matara", phone: "0766677889", email: "dilini.f@gmail.com,", note: "VIP Customer"},
    {id: "C008", name: "Kamal Siriwardena", address: "Ginthota", phone: "0719988776", email: "amara@gmail.com" , note: " "},
    {id: "C009", name: "Tharindu Madusanka", address: "Maha Ambalangoda", phone: "0772233445", email: "tharindu@icloud.com" , note: " "},
    {id: "C010", name: "Ishara Kavindi", address: "Ambalangoda", phone: "0751122339", email: "ishara.k@gmail.com", note: "VIP Customer"}
];

export let itemDB = [
    {id: "I001", name: "Cola Drink", category: "Beverages", price: 150.00, stock: 120, note: "500ml bottle"},
    {id: "I002", name: "Pepsi", category: "Beverages", price: 140.00, stock: 85, note: "Plastic bottle"},
    {id: "I003", name: "Sausage", category: "Snacks", price: 650.00, stock: 40, note: "Chicken 500g"},
    {id: "I004", name: "Chocalate", category: "Snacks", price: 220.00, stock: 200, note: "Large pack"},
    {id: "I005", name: "Milk", category: "Dairy", price: 1000.00, stock: 60, note: "400g bottel"},
    {id: "I006", name: "Butter", category: "Dairy", price: 850.00, stock: 30, note: "Salted 200g"},
    {id: "I007", name: "Milo Carton", category: "Beverages", price: 100.00, stock: 150, note: "180ml"},
    {id: "I008", name: "Sprite", category: "Beverages", price: 150.00, stock: 90, note: "500ml"},
    {id: "I009", name: "Cheese", category: "Dairy", price: 450.00, stock: 25, note: "8 portions"},
    {id: "I010", name: "Rollo", category: "Snacks", price: 80.00, stock: 300, note: "Chocolate flavor"}
];


export let orderDB = [
    {
        orderId: "ORD-001",
        date: "2026-04-20",
        customerId: "C001",
        paymentId: "P001",
        paymentMethod: "Cash",
        items: [
            { id: "I001", name: "Cola Drink", price: 150.00, orderQty: 2 },
            { id: "I003", name: "Sausage", price: 650.00, orderQty: 1 }
        ],
        discount: 0.00,
        total: 950.00
    },
    {
        orderId: "ORD-002",
        date: "2026-04-21",
        customerId: "C005",
        paymentId: "P002",
        paymentMethod: "Card",
        items: [
            { id: "I002", name: "Pepsi", price: 140.00, orderQty: 5 }
        ],
        discount: 50.00,
        total: 650.00
    },
    {
        orderId: "ORD-003",
        date: "2026-04-22",
        customerId: "C002",
        paymentId: "P003",
        paymentMethod: "Cash",
        items: [
            { id: "I004", name: "Chocolate", price: 220.00, orderQty: 3 },
            { id: "I005", name: "Milk", price: 100.00, orderQty: 2 }
        ],
        discount: 10.00,
        total: 850.00
    },
    {
        orderId: "ORD-004",
        date: "2026-04-23",
        customerId: "C003",
        paymentId: "P004",
        paymentMethod: "Card",
        items: [
            { id: "I003", name: "Sausage", price: 650.00, orderQty: 2 }
        ],
        discount: 0.00,
        total: 1300.00
    },
    {
        orderId: "ORD-005",
        date: "2026-04-23",
        customerId: "C001",
        paymentId: "P005",
        paymentMethod: "Cash",
        items: [
            { id: "I005", name: "Milk", price: 100.00, orderQty: 10 }
        ],
        discount: 30.00,
        total: 970.00
    }
];