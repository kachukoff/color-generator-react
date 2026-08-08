import { useState, useEffect } from 'react';
import ColorForm from "./components/ColorForm";

const COOKIE_MAX_AGE = 10800;
const COOKIE_NAME = 'saved_colors_collection';

const setCookie = (name, value, seconds) => {
    let expires = "";
    if (seconds) {
        const date = new Date();
        date.setTime(date.getTime() + (seconds * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(JSON.stringify(value)) + expires + "; path=/; SameSite=Strict";
};

const getCookie = (name) => {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let c = cookies[i].trim();
        if (c.indexOf(nameEQ) === 0) {
            try {
                return JSON.parse(decodeURIComponent(c.substring(nameEQ.length, c.length)));
            } catch (e) {
                return null;
            }
        }
    }
    return null;
};

const defaultColors = [
    { 
        id: 1, 
        name: 'YELLOWGREEN', 
        activeType: 'RGB', 
        codes: { 
            RGB: '154, 205, 50' 
        } 
    },
    { 
        id: 2, 
        name: 'DARKCYAN', 
        activeType: 'RGBA', 
        codes: { 
            RGBA: '0, 139, 139, 1',
            HEX: '#008B8B'
        } 
    },
    { 
        id: 3, 
        name: 'ORANGERED', 
        activeType: 'HEX', 
        codes: { 
            HEX: '#FF4500',
            RGB: '255, 69, 0',
            RGBA: '255, 69, 0, 1'
        } 
    }
];

const getCssColor = (color) => {
    if (!color) return 'transparent';
    
    if (color.codes && color.activeType && color.codes[color.activeType]) {
        const code = color.codes[color.activeType];
        if (color.activeType === 'HEX') return code;
        if (color.activeType === 'RGB') return `rgb(${code})`;
        if (color.activeType === 'RGBA') return `rgba(${code})`;
    }
    
    if (color.codes) {
        if (color.codes.HEX) return color.codes.HEX;
        if (color.codes.RGB) return `rgb(${color.codes.RGB})`;
        if (color.codes.RGBA) return `rgba(${color.codes.RGBA})`;
    }
    
    return 'transparent';
};

export default function App() {
    const [savedColors, setSavedColors] = useState(() => {
        return getCookie(COOKIE_NAME) || defaultColors;
    });

    useEffect(() => {
        setCookie(COOKIE_NAME, savedColors, COOKIE_MAX_AGE);
    }, [savedColors]);

    const handleColorSave = (newColorData) => {
        setSavedColors(prev => {
            const existingColorIndex = prev.findIndex(c => c.name === newColorData.name);

            if (existingColorIndex !== -1) {
                const updatedColors = [...prev];
                const currentCodes = updatedColors[existingColorIndex].codes || {};
                
                updatedColors[existingColorIndex] = {
                    ...updatedColors[existingColorIndex],
                    activeType: newColorData.type,
                    codes: {
                        ...currentCodes,
                        [newColorData.type]: newColorData.code
                    }
                };
                return updatedColors;
            } else {
                const newColorCard = {
                    id: Date.now(),
                    name: newColorData.name,
                    activeType: newColorData.type,
                    codes: {
                        [newColorData.type]: newColorData.code
                    }
                };
                return [newColorCard, ...prev];
            }
        });
    };

    const handleSelectActiveType = (colorId, type) => {
        setSavedColors(prev => prev.map(color => {
            if (color.id === colorId) {
                return { ...color, activeType: type };
            }
            return color;
        }));
    };

    const handleDeleteCodeType = (colorId, typeToDelete) => {
        setSavedColors(prev => {
            return prev.map(color => {
                if (color.id === colorId) {
                    const updatedCodes = { ...color.codes };
                    delete updatedCodes[typeToDelete];

                    const remainingTypes = Object.keys(updatedCodes);
                    
                    if (remainingTypes.length === 0) {
                        return null;
                    }

                    let newActiveType = color.activeType;
                    if (color.activeType === typeToDelete) {
                        newActiveType = remainingTypes[0];
                    }

                    return {
                        ...color,
                        activeType: newActiveType,
                        codes: updatedCodes
                    };
                }
                return color;
            }).filter(Boolean);
        });
    };

        return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-10">
                    <h2 className="text-center mb-4">HTML Цвета</h2>
                    <div className="card mb-4 mx-auto" style={{ maxWidth: '600px' }}>
                        <div className="card-body">
                            <ColorForm onSave={handleColorSave} savedColors={savedColors} />
                        </div>
                    </div>
                    
                    <h3 className="text-center mb-4">Карточки HTML цветов</h3>
                    {savedColors.length === 0 ? (
                        <p className="text-center text-muted">Пока нет сохраненных цветов.</p>
                    ) : (
                        <div className="row">
                            {savedColors.map((color) => (
                                <div key={color.id} className="col-4 mb-3">
                                    <div className="card h-100 shadow-sm" style={{ backgroundColor: 'white' }}>
                                        <div 
                                            className="card-img-top" 
                                            style={{ 
                                                height: '100px', 
                                                backgroundColor: getCssColor(color),
                                                transition: 'background-color 0.3s ease'
                                            }}
                                        ></div>
                                        <div className="card-body">
                                            <h5 className="card-title text-center mb-3">{color.name}</h5>
                                            
                                            {color.codes ? (
                                                Object.entries(color.codes).map(([type, code]) => {
                                                    const isActive = color.activeType === type;
                                                    return (
                                                        <div 
                                                            key={type} 
                                                            onClick={() => handleSelectActiveType(color.id, type)}
                                                            className={`mb-2 p-2 rounded position-relative`}
                                                            style={{ 
                                                                cursor: 'pointer',
                                                                backgroundColor: isActive ? '#fff3cd' : '#f8f9fa', // Желтоватый фон для активного, серый для остальных
                                                                border: isActive ? '1px solid #ffda6a' : '1px solid #dee2e6', // Выделяем рамкой активный формат
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                        >
                                                            <div className="d-flex align-items-center justify-content-between mb-1">
                                                                <small className={`fw-bold ${isActive ? 'text-warning-emphasis' : 'text-secondary'}`}>
                                                                    Тип: {type}
                                                                </small>
                                                                
                                                                <button 
                                                                    type="button" 
                                                                    className="btn btn-sm btn-link text-danger p-0 border-0 lh-1" 
                                                                    onClick={(e) => {
                                                                        e.stopPropagation(); // Останавливаем всплытие события, чтобы клик по крестику не переключал превью
                                                                        handleDeleteCodeType(color.id, type);
                                                                    }}
                                                                    title="Удалить этот формат"
                                                                    style={{ fontSize: '1.2rem', textDecoration: 'none', zIndex: 2 }}
                                                                >
                                                                    &times;
                                                                </button>
                                                            </div>
                                                            <code className="d-block bg-white p-1 rounded border border-light text-break">
                                                                {code}
                                                            </code>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="text-center text-muted">Старый формат. Пересохраните цвет.</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}