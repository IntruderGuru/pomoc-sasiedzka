import { useState } from 'react';
import { create } from '../services/AnnouncementService';
import Nav from "../components/Nav.tsx";

export default function AnnouncementForm() {

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');

  const isValid = title.trim() && content.trim();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return alert('Wszystkie pola muszą być wypełnione');

    const data = { title, content, category, type };
    await create(data);
    alert('Ogłoszenie dodane');
  };

  return (
      <>
          <Nav />
    <form onSubmit={handleSubmit}>
      <h2>Dodaj ogłoszenie</h2>
      <input
        placeholder='Tytuł'
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder='Treść'
        value={content}
        onChange={e => setContent(e.target.value)}
        required
      />
      <input
          placeholder='Kategoria'
          value={category}
          onChange={e => setCategory(e.target.value)}
          required
      />
      <input
          placeholder='Typ'
          value={type}
          onChange={e => setType(e.target.value)}
          required
      />
      <button type='submit'>{'Dodaj ogłoszenie'}</button>
    </form>
      </>
  );
}
