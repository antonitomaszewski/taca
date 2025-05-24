"use client";
import React, { useState } from "react";

export default function RejestracjaParafii() {
  const [nazwa, setNazwa] = useState("");
  const [adres, setAdres] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: obsługa wysyłki formularza
    alert("Dane zostały przesłane (demo)");
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #eee" }}>
      <h2 style={{ marginBottom: 24 }}>Rejestracja parafii</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>Nazwa parafii<br />
            <input type="text" value={nazwa} onChange={e => setNazwa(e.target.value)} required style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }} />
          </label>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Adres<br />
            <input type="text" value={adres} onChange={e => setAdres(e.target.value)} required style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }} />
          </label>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Email<br />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }} />
          </label>
        </div>
        <div style={{ marginBottom: 24 }}>
          <label>Telefon<br />
            <input type="tel" value={telefon} onChange={e => setTelefon(e.target.value)} required style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }} />
          </label>
        </div>
        <button type="submit" style={{ width: "100%", padding: 12, borderRadius: 6, background: "#1976d2", color: "#fff", border: "none", fontWeight: 600, fontSize: 16 }}>Zarejestruj parafię</button>
      </form>
    </div>
  );
}
