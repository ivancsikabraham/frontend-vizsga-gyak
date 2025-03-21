import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const HalakApp = () => {
    const [halak, setHalak] = useState([]);
    const [selectedHal, setSelectedHal] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '' });


    useEffect(() => {
        axios.get('https://halak.onrender.com/api/Halak')
            .then(response => setHalak(response.data))
            .catch(error => console.error('Hiba a halak lekérdezésekor:', error));
    }, []);


    const getHalDetails = (id) => {
        axios.get(`https://halak.onrender.com/api/Halak/${id}`)
            .then(response => {
                setSelectedHal(response.data);
                setFormData({ name: response.data.name, description: response.data.description });
                setEditMode(false);
            })
            .catch(error => console.error('Hiba a hal részleteinek lekérdezésekor:', error));
    };


    const updateHal = (id) => {
        axios.put(`https://halak.onrender.com/api/Halak/${id}`, formData)
            .then(() => {
                alert('A hal adatai sikeresen módosítva!');
                setEditMode(false);
                getHalDetails(id);
            })
            .catch(error => console.error('Hiba a hal módosításakor:', error));
    };


    const getImageUrl = (blob) => {
        const binary = new Uint8Array(blob.data);
        const blobData = new Blob([binary.buffer], { type: 'image/jpeg' });
        return URL.createObjectURL(blobData);
    };

    return (
        <div className="container">
            <h1 className="my-4">Halak kezelése</h1>
            <ul className="list-group mb-4">
                {halak.map(hal => (
                    <li key={hal.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>{hal.name}</span>
                        <div>
                            <button className="btn btn-primary me-2" onClick={() => getHalDetails(hal.id)}>
                                <i className="bi bi-text-paragraph"></i> Részletek
                            </button>
                            <button className="btn btn-secondary" onClick={() => { setEditMode(true); setSelectedHal(hal); }}>
                                <i className="bi bi-pencil-square"></i> Szerkesztés
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            {selectedHal && (
                <div>
                    <h2>{selectedHal.name}</h2>
                    {selectedHal.image && <img src={getImageUrl(selectedHal.image)} alt="Hal kép" className="img-fluid mb-3" />}
                    {!editMode ? (
                        <p>{selectedHal.description}</p>
                    ) : (
                        <div>
                            <input className="form-control mb-2" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            <textarea className="form-control mb-2" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
                            <button className="btn btn-success" onClick={() => updateHal(selectedHal.id)}>Mentés</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HalakApp;
