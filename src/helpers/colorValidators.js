// Валидация имени цвета «на лету»
export const validateName = (nameValue, existingColors, currentType) => {
    const trimmed = nameValue.trim();
    if (!trimmed) return 'Название обязательно для заполнения';
    if (!/^[A-Za-zА-Яа-яёЁ]+$/.test(trimmed)) return 'Имя цвета должно содержать только буквы';
    
    const existingColor = existingColors.find(c => c.name.toLowerCase() === trimmed.toLowerCase());
    if (existingColor && existingColor.codes?.[currentType.toUpperCase()]) {
        return `Для цвета ${trimmed.toUpperCase()} код формата ${currentType.toUpperCase()} уже добавлен`;
    }
    return null;
};

// Валидация кода цвета под выбранный тип
export const checkCodeValidity = (currentCode, currentType) => {
    const cleanCode = currentCode.trim();
    if (!cleanCode) return 'Код цвета обязателен для заполнения';
    
    const typeLower = currentType.toLowerCase();

    if (typeLower === 'hex') {
        if (!/^#[0-9A-Fa-f]{6}$/.test(cleanCode)) return 'Код HEX должен соответствовать шаблону #XXXXXX';
        return null;
    }

    const parts = cleanCode.split(',').map(s => s.trim());
    
    if (typeLower === 'rgb') {
        if (parts.length !== 3 || !parts.every(p => /^\d+$/.test(p))) {
            return 'Код RGB должен соответствовать шаблону [0-255], [0-255], [0-255]';
        }
        if (parts.some(p => parseInt(p, 10) < 0 || parseInt(p, 10) > 255)) {
            return 'Числа в RGB должны быть в диапазоне от 0 до 255';
        }
        return null;
    }

    if (typeLower === 'rgba') {
        if (parts.length !== 4) return 'Код RGBA должен соответствовать шаблону [0-255], [0-255], [0-255], [0-1]';
        
        const rgbParts = parts.slice(0, 3);
        if (!rgbParts.every(p => /^\d+$/.test(p)) || rgbParts.some(p => parseInt(p, 10) < 0 || parseInt(p, 10) > 255)) {
            return 'Числа RGB внутри RGBA должны быть в диапазоне от 0 до 255';
        }

        if (!/^(0|1|0\.\d+)$/.test(parts[3])) return 'Значение альфа-канала должно быть в диапазоне от 0 до 1';
        return null;
    }

    return 'Неизвестный тип цвета';
};
