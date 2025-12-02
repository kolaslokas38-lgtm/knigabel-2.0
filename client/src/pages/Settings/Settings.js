import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { UserContext } from '../../context/UserContext';
import { ThemeContext } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../styles/themes';
import { FiSettings, FiTool, FiBookOpen, FiBell, FiGlobe, FiShield, FiDownload, FiUpload, FiSave, FiRotateCcw, FiDroplet } from 'react-icons/fi';
import { FaMoon, FaSun, FaDesktop } from 'react-icons/fa';

const SettingsContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  color: ${props => props.theme.text};
  font-size: 2.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.textLight};
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto;
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  background: ${props => props.theme.card};
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.border};
  height: fit-content;
  position: sticky;
  top: 2rem;
`;

const SidebarTitle = styled.h3`
  color: ${props => props.theme.text};
  font-size: 1.2rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SettingsMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  background: ${props => props.active ? props.theme.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.text};
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;

  &:hover {
    background: ${props => props.active ? props.theme.primaryDark : props.theme.accent};
  }

  svg {
    font-size: 1.1rem;
  }
`;

const ContentArea = styled.div`
  background: ${props => props.theme.card};
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid ${props => props.theme.border};
  min-height: 600px;
`;

const SectionTitle = styled.h2`
  color: ${props => props.theme.text};
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SettingsSection = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SectionTitleSmall = styled.h3`
  color: ${props => props.theme.text};
  font-size: 1.2rem;
  margin: 0;
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.border};

  &:last-child {
    border-bottom: none;
  }
`;

const SettingInfo = styled.div`
  flex: 1;
`;

const SettingLabel = styled.label`
  display: block;
  font-size: 1rem;
  font-weight: 500;
  color: ${props => props.theme.text};
  margin-bottom: 0.25rem;
`;

const SettingDescription = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.textLight};
  margin: 0;
`;

const SettingControl = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: ${props => props.theme.primary};
  }

  &:checked + span:before {
    transform: translateX(26px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.theme.backgroundSecondary};
  transition: 0.4s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const Select = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  background: ${props => props.theme.backgroundSecondary};
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const Slider = styled.input`
  width: 120px;
  -webkit-appearance: none;
  height: 6px;
  border-radius: 3px;
  background: ${props => props.theme.backgroundSecondary};
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.theme.primary};
    cursor: pointer;
  }
`;

const ColorPicker = styled.input`
  width: 50px;
  height: 40px;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: 4px;
  }
`;

const ThemePreview = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const ThemeOption = styled.button`
  width: 60px;
  height: 40px;
  border: 2px solid ${props => props.selected ? props.theme.primary : props.theme.border};
  border-radius: 6px;
  cursor: pointer;
  background: ${props => props.background};
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const FontPreview = styled.div`
  font-family: ${props => props.font};
  font-size: 1.1rem;
  padding: 0.5rem;
  background: ${props => props.theme.backgroundSecondary};
  border-radius: 4px;
  margin-top: 0.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${props => props.theme.border};
`;

const ActionButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.primary ? props.theme.primary : props.theme.backgroundSecondary};
  color: ${props => props.primary ? 'white' : props.theme.text};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: ${props => props.primary ? props.theme.primaryDark : props.theme.accent};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const Settings = () => {
  const { user, updateUser } = useContext(UserContext);
  const { theme, customColors, settings: themeSettings, toggleTheme, updateCustomColors, updateSettings } = useContext(ThemeContext);

  const [activeSection, setActiveSection] = useState('appearance');
  const [settings, setSettings] = useState({
    // Appearance
    theme: theme,
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    fontFamily: 'Inter, sans-serif',
    fontSize: 16,

    // Reading
    readingFontSize: 1.1,
    readingLineHeight: 1.6,
    readingFontFamily: 'Georgia, serif',

    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    readingReminders: false,
    newBooksNotifications: true,

    // Language
    language: 'ru',

    // Privacy
    profileVisibility: 'public',
    showReadingStats: true,
    allowDataCollection: false,

    // Advanced
    autoSave: true,
    preloadBooks: true,
    offlineMode: true
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Load user settings and theme settings
    const userSettings = user?.settings || {};
    const currentThemeSettings = {
      theme: theme,
      primaryColor: customColors.primary,
      secondaryColor: customColors.secondary,
      fontFamily: themeSettings.fontFamily,
      fontSize: themeSettings.fontSize,
      readingFontSize: themeSettings.readingFontSize,
      readingLineHeight: themeSettings.readingLineHeight,
      readingFontFamily: themeSettings.readingFontFamily
    };

    setSettings(prev => ({ ...prev, ...userSettings, ...currentThemeSettings }));
  }, [user, theme, customColors, themeSettings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = async () => {
    try {
      const updatedUser = {
        ...user,
        settings: settings
      };

      updateUser(updatedUser);

      // Apply theme changes immediately
      if (settings.theme !== theme) {
        toggleTheme();
      }

      // Apply color changes immediately
      if (settings.primaryColor !== customColors.primary || settings.secondaryColor !== customColors.secondary) {
        updateCustomColors({
          primary: settings.primaryColor,
          secondary: settings.secondaryColor
        });
      }

      // Apply font settings immediately
      if (settings.fontFamily !== themeSettings.fontFamily ||
          settings.fontSize !== themeSettings.fontSize ||
          settings.readingFontSize !== themeSettings.readingFontSize ||
          settings.readingLineHeight !== themeSettings.readingLineHeight ||
          settings.readingFontFamily !== themeSettings.readingFontFamily) {
        updateSettings({
          fontFamily: settings.fontFamily,
          fontSize: settings.fontSize,
          readingFontSize: settings.readingFontSize,
          readingLineHeight: settings.readingLineHeight,
          readingFontFamily: settings.readingFontFamily
        });
      }

      setHasChanges(false);
      alert('Настройки сохранены!');
    } catch (error) {
      alert('Ошибка сохранения настроек');
    }
  };

  const resetSettings = () => {
    setSettings({
      theme: 'light',
      primaryColor: '#667eea',
      secondaryColor: '#764ba2',
      fontFamily: 'Inter, sans-serif',
      fontSize: 16,
      readingFontSize: 1.1,
      readingLineHeight: 1.6,
      readingFontFamily: 'Georgia, serif',
      emailNotifications: true,
      pushNotifications: true,
      readingReminders: false,
      newBooksNotifications: true,
      language: 'ru',
      profileVisibility: 'public',
      showReadingStats: true,
      allowDataCollection: false,
      autoSave: true,
      preloadBooks: true,
      offlineMode: true
    });
    setHasChanges(true);
    alert('Настройки сброшены к умолчанию');
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = 'knigabel-settings.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    alert('Настройки экспортированы!');
  };

  const importSettings = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          setSettings(prev => ({ ...prev, ...importedSettings }));
          setHasChanges(true);
          alert('Настройки импортированы!');
        } catch (error) {
          alert('Ошибка импорта настроек');
        }
      };
      reader.readAsText(file);
    }
  };

  const menuItems = [
    { id: 'appearance', label: 'Внешний вид', icon: FiDroplet },
    { id: 'reading', label: 'Чтение', icon: FiBookOpen },
    { id: 'notifications', label: 'Уведомления', icon: FiBell },
    { id: 'language', label: 'Язык', icon: FiGlobe },
    { id: 'privacy', label: 'Приватность', icon: FiShield },
    { id: 'advanced', label: 'Дополнительно', icon: FiSettings }
  ];

  const renderAppearanceSettings = () => (
    <div>
      <SettingsSection>
        <SectionHeader>
          <SectionTitleSmall>Тема</SectionTitleSmall>
        </SectionHeader>

        <SettingItem>
          <SettingInfo>
            <SettingLabel>Режим темы</SettingLabel>
            <SettingDescription>Выберите предпочтительный режим отображения</SettingDescription>
          </SettingInfo>
          <SettingControl>
            <ThemePreview>
              <ThemeOption
                selected={settings.theme === 'light'}
                background="linear-gradient(135deg, #fff 0%, #f8fafc 100%)"
                onClick={() => updateSetting('theme', 'light')}
              >
                <FaSun size={16} color="#f59e0b" />
              </ThemeOption>
              <ThemeOption
                selected={settings.theme === 'dark'}
                background="linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
                onClick={() => updateSetting('theme', 'dark')}
              >
                <FaMoon size={16} color="#60a5fa" />
              </ThemeOption>
              <ThemeOption
                selected={settings.theme === 'auto'}
                background="linear-gradient(135deg, #fff 50%, #1e293b 50%)"
                onClick={() => updateSetting('theme', 'auto')}
              >
                <FaDesktop size={16} color="#6b7280" />
              </ThemeOption>
            </ThemePreview>
          </SettingControl>
        </SettingItem>

        <SettingItem>
          <SettingInfo>
            <SettingLabel>Основной цвет</SettingLabel>
            <SettingDescription>Цвет акцентов и кнопок</SettingDescription>
          </SettingInfo>
          <SettingControl>
            <ColorPicker
              type="color"
              value={settings.primaryColor}
              onChange={(e) => updateSetting('primaryColor', e.target.value)}
            />
          </SettingControl>
        </SettingItem>

        <SettingItem>
          <SettingInfo>
            <SettingLabel>Вторичный цвет</SettingLabel>
            <SettingDescription>Цвет градиентов и фонов</SettingDescription>
          </SettingInfo>
          <SettingControl>
            <ColorPicker
              type="color"
              value={settings.secondaryColor}
              onChange={(e) => updateSetting('secondaryColor', e.target.value)}
            />
          </SettingControl>
        </SettingItem>
      </SettingsSection>

      <SettingsSection>
        <SectionHeader>
          <SectionTitleSmall>Шрифты</SectionTitleSmall>
        </SectionHeader>

        <SettingItem>
          <SettingInfo>
            <SettingLabel>Основной шрифт</SettingLabel>
            <SettingDescription>Шрифт интерфейса приложения</SettingDescription>
          </SettingInfo>
          <SettingControl>
            <Select
              value={settings.fontFamily}
              onChange={(e) => updateSetting('fontFamily', e.target.value)}
            >
              <option value="Inter, sans-serif">Inter</option>
              <option value="Roboto, sans-serif">Roboto</option>
              <option value="Open Sans, sans-serif">Open Sans</option>
              <option value="Lato, sans-serif">Lato</option>
              <option value="Poppins, sans-serif">Poppins</option>
            </Select>
          </SettingControl>
        </SettingItem>

        <SettingItem>
          <SettingInfo>
            <SettingLabel>Размер шрифта</SettingLabel>
            <SettingDescription>Базовый размер текста интерфейса</SettingDescription>
          </SettingInfo>
          <SettingControl>
            <Slider
              type="range"
              min="14"
              max="20"
              value={settings.fontSize}
              onChange={(e) => updateSetting('fontSize', e.target.value)}
            />
            <span>{settings.fontSize}px</span>
          </SettingControl>
        </SettingItem>
      </SettingsSection>
    </div>
  );

  const renderReadingSettings = () => (
    <div>
      <SettingsSection>
        <SectionHeader>
          <SectionTitleSmall>Настройки чтения</SectionTitleSmall>
        </SectionHeader>

        <SettingItem>
          <SettingInfo>
            <SettingLabel>Шрифт для чтения</SettingLabel>
            <SettingDescription>Шрифт текста книг</SettingDescription>
          </SettingInfo>
          <SettingControl>
            <Select
              value={settings.readingFontFamily}
              onChange={(e) => updateSetting('readingFontFamily', e.target.value)}
            >
              <option value="Georgia, serif">Georgia</option>
              <option value="Times New Roman, serif">Times New Roman</option>
              <option value="Bookerly, serif">Bookerly</option>
              <option value="Inter, sans-serif">Inter</option>
              <option value="Open Sans, sans-serif">Open Sans</option>
            </Select>
          </SettingControl>
        </SettingItem>

        <SettingItem>
          <SettingInfo>
            <SettingLabel>Размер шрифта чтения</SettingLabel>
            <SettingDescription>Размер текста при чтении книг</SettingDescription>
          </SettingInfo>
          <SettingControl>
            <Slider
              type="range"
              min="0.8"
              max="2.0"
              step="0.1"
              value={settings.readingFontSize}
              onChange={(e) => updateSetting('readingFontSize', parseFloat(e.target.value))}
            />
            <span>{settings.readingFontSize}rem</span>
          </SettingControl>
        </SettingItem>

        <SettingItem>
          <SettingInfo>
            <SettingLabel>Межстрочный интервал</SettingLabel>
            <SettingDescription>Расстояние между строками текста</SettingDescription>
          </SettingInfo>
          <SettingControl>
            <Slider
              type="range"
              min="1.2"
              max="2.0"
              step="0.1"
              value={settings.readingLineHeight}
              onChange={(e) => updateSetting('readingLineHeight', parseFloat(e.target.value))}
            />
            <span>{settings.readingLineHeight}</span>
          </SettingControl>
        </SettingItem>
      </SettingsSection>

      <SettingsSection>
        <SectionHeader>
          <SectionTitleSmall>Превью</SectionTitleSmall>
        </SectionHeader>
        <FontPreview
          font={settings.readingFontFamily}
          style={{
            fontSize: `${settings.readingFontSize}rem`,
            lineHeight: settings.readingLineHeight
          }}
        >
          "Война и мир" - это монументальный роман-эпопея Льва Толстого,
          описывающий русское общество в эпоху войн против Наполеона.
          Произведение поражает своей глубиной и масштабом...
        </FontPreview>
      </SettingsSection>
    </div>
  );

  const renderNotificationSettings = () => (
    <div>
      <SettingsSection>
        <SectionHeader>
          <SectionTitleSmall>Типы уведомлений</SectionTitleSmall>
        </SectionHeader>

        <SettingItem>
          <SettingInfo>
            <SettingLabel>Email уведомления</SettingLabel>
            <SettingDescription>Получать уведомления на email</SettingDescription>
          </SettingInfo>
          <SettingControl>
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => updateSetting('emailNotifications', e.target.checked)}
              />
              <ToggleSlider />
            </ToggleSwitch>
          </SettingControl>
        </SettingItem>

        <SettingItem>
          <SettingInfo>
            <SettingLabel>Push уведомления</SettingLabel>
            <SettingDescription>Получать push уведомления в браузере</SettingDescription>
          </SettingInfo>
          <SettingControl>
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) => updateSetting('pushNotifications', e.target.checked)}
              />
              <ToggleSlider />
            </ToggleSwitch>
          </SettingControl>
        </SettingItem>

        <SettingItem>
          <SettingInfo>
            <SettingLabel>Напоминания о чтении</SettingLabel>
            <SettingDescription>Ежедневные напоминания о необходимости почитать</SettingDescription>
          </SettingInfo>
          <SettingControl>
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                checked={settings.readingReminders}
                onChange={(e) => updateSetting('readingReminders', e.target.checked)}
              />
              <ToggleSlider />
            </ToggleSwitch>
          </SettingControl>
        </SettingItem>

        <SettingItem>
          <SettingInfo>
            <SettingLabel>Новые книги</SettingLabel>
            <SettingDescription>Уведомления о новых книгах в каталоге</SettingDescription>
          </SettingInfo>
          <SettingControl>
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                checked={settings.newBooksNotifications}
                onChange={(e) => updateSetting('newBooksNotifications', e.target.checked)}
              />
              <ToggleSlider />
            </ToggleSwitch>
          </SettingControl>
        </SettingItem>
      </SettingsSection>
    </div>
  );

  const renderLanguageSettings = () => (
    <div>
      <SettingsSection>
        <SectionHeader>
          <SectionTitleSmall>Язык интерфейса</SectionTitleSmall>
        </SectionHeader>

        <SettingItem>
          <SettingInfo>
            <SettingLabel>Язык приложения</SettingLabel>
            <SettingDescription>Выберите язык интерфейса</SettingDescription>
          </SettingInfo>
          <SettingControl>
            <Select
              value={settings.language}
              onChange={(e) => updateSetting('language', e.target.value)}
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
              <option value="be">Беларуская</option>
            </Select>
          </SettingControl>
        </SettingItem>
      </SettingsSection>
    </div>
  );

  const renderPrivacySettings = () => (
    <div>
      <SettingsSection>
        <SectionHeader>
          <SectionTitleSmall>Видимость профиля</SectionTitleSmall>
        </SectionHeader>

        <SettingItem>
          <SettingInfo>
            <SettingLabel>Видимость профиля</SettingLabel>
            <SettingDescription>Кто может видеть ваш профиль и статистику</SettingDescription>
          </SettingInfo>
          <SettingControl>
            <Select
              value={settings.profileVisibility}
              onChange={(e) => updateSetting('profileVisibility', e.target.value)}
            >
              <option value="public">Публичный</option>
              <option value="friends">Только друзья</option>
              <option value="private">Приватный</option>
            </Select>
          </SettingControl>
        </SettingItem>

        <SettingItem>
          <SettingInfo>
            <SettingLabel>Показывать статистику чтения</SettingLabel>
            <SettingDescription>Отображать статистику чтения в профиле</SettingDescription>
          </SettingInfo>
          <SettingControl>
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                checked={settings.showReadingStats}
                onChange={(e) => updateSetting('showReadingStats', e.target.checked)}
              />
              <ToggleSlider />
            </ToggleSwitch>
          </SettingControl>
        </SettingItem>

        <SettingItem>
          <SettingInfo>
            <SettingLabel>Сбор аналитики</SettingLabel>
            <SettingDescription>Разрешить сбор анонимной статистики использования</SettingDescription>
          </SettingInfo>
          <SettingControl>
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                checked={settings.allowDataCollection}
                onChange={(e) => updateSetting('allowDataCollection', e.target.checked)}
              />
              <ToggleSlider />
            </ToggleSwitch>
          </SettingControl>
        </SettingItem>
      </SettingsSection>
    </div>
  );

  const renderAdvancedSettings = () => (
    <div>
      <SettingsSection>
        <SectionHeader>
          <SectionTitleSmall>Производительность</SectionTitleSmall>
        </SectionHeader>

        <SettingItem>
          <SettingInfo>
            <SettingLabel>Автосохранение</SettingLabel>
            <SettingDescription>Автоматически сохранять прогресс чтения</SettingDescription>
          </SettingInfo>
          <SettingControl>
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => updateSetting('autoSave', e.target.checked)}
              />
              <ToggleSlider />
            </ToggleSwitch>
          </SettingControl>
        </SettingItem>

        <SettingItem>
          <SettingInfo>
            <SettingLabel>Предварительная загрузка</SettingLabel>
            <SettingDescription>Загружать книги заранее для быстрого доступа</SettingDescription>
          </SettingInfo>
          <SettingControl>
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                checked={settings.preloadBooks}
                onChange={(e) => updateSetting('preloadBooks', e.target.checked)}
              />
              <ToggleSlider />
            </ToggleSwitch>
          </SettingControl>
        </SettingItem>

        <SettingItem>
          <SettingInfo>
            <SettingLabel>Оффлайн режим</SettingLabel>
            <SettingDescription>Включить кеширование для оффлайн использования</SettingDescription>
          </SettingInfo>
          <SettingControl>
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                checked={settings.offlineMode}
                onChange={(e) => updateSetting('offlineMode', e.target.checked)}
              />
              <ToggleSlider />
            </ToggleSwitch>
          </SettingControl>
        </SettingItem>
      </SettingsSection>

      <SettingsSection>
        <SectionHeader>
          <SectionTitleSmall>Управление данными</SectionTitleSmall>
        </SectionHeader>

        <ActionButtons>
          <ActionButton onClick={exportSettings}>
            <FiDownload />
            Экспорт настроек
          </ActionButton>
          <ActionButton as="label">
            <FiUpload />
            Импорт настроек
            <input
              type="file"
              accept=".json"
              onChange={importSettings}
              style={{ display: 'none' }}
            />
          </ActionButton>
        </ActionButtons>
      </SettingsSection>
    </div>
  );

  const renderContent = () => {
    switch(activeSection) {
      case 'appearance': return renderAppearanceSettings();
      case 'reading': return renderReadingSettings();
      case 'notifications': return renderNotificationSettings();
      case 'language': return renderLanguageSettings();
      case 'privacy': return renderPrivacySettings();
      case 'advanced': return renderAdvancedSettings();
      default: return renderAppearanceSettings();
    }
  };

  return (
    <SettingsContainer>
      <Header>
        <Title>
          <FiSettings />
          Настройки
        </Title>
        <Subtitle>
          Настройте приложение под себя для максимального комфорта использования
        </Subtitle>
      </Header>

      <SettingsGrid>
        <Sidebar>
          <SidebarTitle>
            <FiSettings />
            Категории
          </SidebarTitle>
          <SettingsMenu>
            {menuItems.map((item) => (
              <MenuItem
                key={item.id}
                active={activeSection === item.id}
                onClick={() => setActiveSection(item.id)}
              >
                <item.icon />
                {item.label}
              </MenuItem>
            ))}
          </SettingsMenu>
        </Sidebar>

        <ContentArea>
          <SectionTitle>
            {(() => {
              const activeItem = menuItems.find(item => item.id === activeSection);
              const IconComponent = activeItem?.icon;
              return IconComponent ? <IconComponent /> : null;
            })()}
            {menuItems.find(item => item.id === activeSection)?.label}
          </SectionTitle>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>

          <ActionButtons>
            <ActionButton onClick={resetSettings}>
              <FiRotateCcw />
              Сбросить
            </ActionButton>
            <ActionButton
              primary
              onClick={saveSettings}
              disabled={!hasChanges}
            >
              <FiSave />
              Сохранить настройки
            </ActionButton>
          </ActionButtons>
        </ContentArea>
      </SettingsGrid>
    </SettingsContainer>
  );
};

export default Settings;