import { useState } from "react";

const groceryItems = [
  {
    id: 1,
    nama: 'Daging',
    quantity: 3,
    checked: false,
  },
  {
    id: 2,
    nama: 'Kopi Bubuk',
    quantity: 1,
    checked: false,
  },
  {
    id: 3,
    nama: 'Susu',
    quantity: 9,
    checked: true
  }
];


export default function App() {

  const [items, setItems] = useState(groceryItems);

  // Menambahkan Item
  function HandleAddItem(item) {
    setItems([...items, item]);
  }

  // Menghapus Item
  function HandleDeleteItem(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  // membuat toggle
  function HandleToggleItem(id) {
    setItems((items) => items.map((item) => item.id === id ? {...item, checked: !item.checked} : item));
  }

  function HandleClearItems() {
    setItems([]);
  }

  return (
      <div className="app">
        <Header />
        <Form onAddItem={HandleAddItem} />
        <GroceryList items={items} onDeleteItem={HandleDeleteItem} onToggleItem={HandleToggleItem} onClearItems={HandleClearItems} />
        <Footer items={items}/>
      </div>
  );
}

function Header() {
  return (<h1>Catatan Bahan</h1>)
}

function Form({onAddItem}) {
  const [name, setName] = useState();
  const [quantity, setQuantity] = useState(1);

  function HandleSubmit(e) {
    e.preventDefault();

    if (!name) return;

    const newItem = {
      id: Date.now(),
      nama: name, 
      quantity: quantity,
      checked: false,
    }
    onAddItem(newItem);

    console.log(newItem);

    setName('');
    setQuantity(1)

  }

  const quantityNum = [...Array(20)].map((_,i) => (
    <option value={i + 1} key={i + 1}>
      {i + 1}
    </option>
  ));

  return (
    <form onSubmit={HandleSubmit}>
      <h3>Tulis Bahan</h3>
      <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
        {quantityNum}
      </select>
      <input type="text" placeholder="Nama Barang ..." value={name} onChange={(e) => setName(e.target.value)} />
      <button>Tambah</button>
    </form>
  );
}

function GroceryList({items, onDeleteItem, onToggleItem, onClearItems}) {
  const [sortBy, setSortBy] = useState('input');

  let sortedItems;

  // if (sortBy === 'input') {
  //   sortedItems = items;
  // }

  // if (sortBy === 'nama') {
  //   sortedItems = items.slice().sort((a, b) => a.nama.localeCompare(b.nama));
  // }

  // if (sortBy === 'checked') {
  //   sortedItems = items.slice().sort((a, b) => a.checked - b.nama );
  // }

  switch (sortBy) {
    case 'nama':
      sortedItems = items.slice().sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'checked':
      sortedItems = items.slice().sort((a, b) => a.checked - b.checked );
      break;
    default:
      sortedItems = items;
      break;
  }


  return (
    <>
      <div className="list">
        <ul>
          {sortedItems.map((item) => (
            <Item item={item} key={item.id} onDeleteItem={onDeleteItem} onToggleItem={onToggleItem} />
          ))}
        </ul>
      </div>
      <div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Urutkan Berdasarkan Urutan Input</option>
          <option value="name">Urutkan Berdasarkan Nama Barang</option>
          <option value="checked">Urutkan Berdasarkan Ceklis</option>
        </select>
        <button onClick={onClearItems}>Bersihkan Daftar</button>
      </div>
    </>
  );
}

function Item({item, onDeleteItem, onToggleItem}) {
  return (
    <li key={item.id}>
      <input type="checkbox" onChange={() => onToggleItem(item.id)} />
      <span style={item.checked ? {textDecoration: 'line-through'} : {}}>
        {item.quantity} {item.nama}
      </span>
      <button onClick={() => onDeleteItem(item.id)}>&times;</button>
    </li>
  );
}

function Footer({items}) {
if (items.length === 0) return <footer>tidak ada barang didaftar belanja, tidak ada barang sudah di beli(0%)</footer>;

  const totalItems = items.length;
  const checkedItems = items.filter((item) => item.checked).length;
  const percentage = Math.round((checkedItems / totalItems) * 100);

  return <footer>Ada {totalItems} barang didaftar belanja, {checkedItems} barang sudah di beli({percentage})</footer>;
}