import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { UserContext } from '../../context/UserContext';
import { LibraryContext } from '../../context/LibraryContext';
import { apiService } from '../../services/appService';
import { FiBook, FiUsers, FiBarChart2, FiSettings, FiPlus, FiEdit, FiTrash2, FiEye, FiDownload, FiUpload } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const Title = styled.h1`
  color: ${props => props.theme.text};
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${props => props.theme.textLight};
  font-size: 0.9rem;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  background: ${props => props.active ? props.theme.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.text};
  border-radius: 8px 8px 0 0;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: ${props => props.active ? props.theme.primaryDark : props.theme.backgroundSecondary};
  }
`;

const ContentArea = styled(motion.div)`
  background: ${props => props.theme.card};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: ${props => props.theme.cardShadow};
  border: 1px solid ${props => props.theme.border};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${props => props.theme.backgroundSecondary};
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  background: ${props => props.theme.primary};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  color: ${props => props.theme.textLight};
  font-size: 0.9rem;
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const SearchInput = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  min-width: 250px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.primary ? props.theme.primary : props.theme.backgroundSecondary};
  color: ${props => props.primary ? 'white' : props.theme.text};
  border: 1px solid ${props => props.primary ? props.theme.primary : props.theme.border};
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: ${props => props.primary ? props.theme.primaryDark : props.theme.accent};
    transform: translateY(-1px);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  background: ${props => props.theme.backgroundSecondary};
  border-bottom: 1px solid ${props => props.theme.border};
  font-weight: 600;
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.borderLight};
  color: ${props => props.theme.text};
`;

const TableRow = styled.tr`
  &:hover {
    background: ${props => props.theme.backgroundSecondary};
  }
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;

  ${props => props.available ? `
    background: #F0FFF4;
    color: #22543D;
  ` : `
    background: #FFF5F5;
    color: #742A2A;
  `}
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  width: 32px;
  height: 32px;
  border: 1px solid ${props => props.theme.border};
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.danger ? '#FED7D7' : props.theme.accent};
    border-color: ${props => props.danger ? '#FC8181' : props.theme.primary};
    color: ${props => props.danger ? '#C53030' : props.theme.primary};
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background: ${props => props.theme.card};
  border-radius: 12px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  border: 1px solid ${props => props.theme.border};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: ${props => props.theme.text};
  font-size: 1.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.theme.textLight};

  &:hover {
    color: ${props => props.theme.text};
  }
`;

const Form = styled.form`
  display: grid;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: grid;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: ${props => props.theme.text};
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

const AdminPanel = () => {
  const { user, updateUser } = useContext(UserContext);
  const { libraryData } = useContext(LibraryContext);
  const [activeTab, setActiveTab] = useState('books');
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      if (activeTab === 'books') {
        const booksData = await apiService.getBooks();
        setBooks(booksData.data.books || []);
      } else if (activeTab === 'users') {
        const usersData = await apiService.getUsers();
        setUsers(usersData.data.users || []);
      } else if (activeTab === 'stats') {
        const statsData = await apiService.getStats();
        setStats(statsData.data || {});
      }
    } catch (error) {
      toast.error('Ошибка загрузки данных');
      console.error(error);
    }
  };

  const handleAdd = () => {
    setModalType('add');
    setSelectedItem(null);
    setFormData(activeTab === 'books' ? {
      title: '',
      author: '',
      genre: '',
      year: new Date().getFullYear(),
      description: '',
      pages: 0,
      rating: 0,
      icon: '📖',
      available: true
    } : {
      name: '',
      email: '',
      role: 'user'
    });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setModalType('edit');
    setSelectedItem(item);
    setFormData({ ...item });
    setShowModal(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Вы уверены, что хотите удалить ${activeTab === 'books' ? 'книгу' : 'пользователя'} "${item.title || item.name}"?`)) {
      return;
    }

    try {
      if (activeTab === 'books') {
        // For demo purposes, we'll just remove from local state
        // In real app, this would call an API
        setBooks(books.filter(book => book.id !== item.id));
        toast.success('Книга удалена');
      } else if (activeTab === 'users') {
        setUsers(users.filter(u => u.id !== item.id));
        toast.success('Пользователь удален');
      }
    } catch (error) {
      toast.error('Ошибка удаления');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (activeTab === 'books') {
        if (modalType === 'add') {
          const newBook = {
            ...formData,
            id: Date.now(),
            reviewsCount: 0
          };
          setBooks([...books, newBook]);
          toast.success('Книга добавлена');
        } else {
          setBooks(books.map(book =>
            book.id === selectedItem.id ? { ...book, ...formData } : book
          ));
          toast.success('Книга обновлена');
        }
      } else if (activeTab === 'users') {
        if (modalType === 'add') {
          const newUser = {
            ...formData,
            id: Date.now(),
            registrationDate: new Date().toLocaleDateString('ru-RU')
          };
          setUsers([...users, newUser]);
          toast.success('Пользователь добавлен');
        } else {
          const updatedUser = { ...selectedItem, ...formData };
          setUsers(users.map(u =>
            u.id === selectedItem.id ? updatedUser : u
          ));

          // Если редактируется текущий пользователь, обновляем глобальный контекст
          if (selectedItem.id === user?.id || selectedItem.telegramId === user?.telegramId) {
            updateUser(updatedUser);
            toast.success('Ваш профиль обновлен');
          } else {
            toast.success('Пользователь обновлен');
          }
        }
      }

      setShowModal(false);
    } catch (error) {
      toast.error('Ошибка сохранения');
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStats = () => (
    <StatsGrid>
      <StatCard>
        <StatIcon><FiBook /></StatIcon>
        <StatInfo>
          <StatValue>{stats.totalBooks || 0}</StatValue>
          <StatLabel>Всего книг</StatLabel>
        </StatInfo>
      </StatCard>
      <StatCard>
        <StatIcon><FiUsers /></StatIcon>
        <StatInfo>
          <StatValue>{stats.totalUsers || 0}</StatValue>
          <StatLabel>Пользователей</StatLabel>
        </StatInfo>
      </StatCard>
      <StatCard>
        <StatIcon><FiBarChart2 /></StatIcon>
        <StatInfo>
          <StatValue>{stats.totalBorrows || 0}</StatValue>
          <StatLabel>Выдач книг</StatLabel>
        </StatInfo>
      </StatCard>
      <StatCard>
        <StatIcon><FiSettings /></StatIcon>
        <StatInfo>
          <StatValue>{stats.totalGenres || 0}</StatValue>
          <StatLabel>Жанров</StatLabel>
        </StatInfo>
      </StatCard>
    </StatsGrid>
  );

  const renderBooksTable = () => (
    <>
      <ActionBar>
        <SearchInput
          placeholder="Поиск книг..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <ActionButton primary onClick={handleAdd}>
          <FiPlus /> Добавить книгу
        </ActionButton>
      </ActionBar>

      <Table>
        <thead>
          <tr>
            <TableHeader>Название</TableHeader>
            <TableHeader>Автор</TableHeader>
            <TableHeader>Жанр</TableHeader>
            <TableHeader>Статус</TableHeader>
            <TableHeader>Действия</TableHeader>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map(book => (
            <TableRow key={book.id}>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.genre}</TableCell>
              <TableCell>
                <StatusBadge available={book.available}>
                  {book.available ? 'Доступна' : 'Занята'}
                </StatusBadge>
              </TableCell>
              <TableCell>
                <ActionButtons>
                  <IconButton onClick={() => handleEdit(book)}>
                    <FiEdit />
                  </IconButton>
                  <IconButton danger onClick={() => handleDelete(book)}>
                    <FiTrash2 />
                  </IconButton>
                </ActionButtons>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </>
  );

  const renderUsersTable = () => (
    <>
      <ActionBar>
        <SearchInput
          placeholder="Поиск пользователей..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <ActionButton primary onClick={handleAdd}>
          <FiPlus /> Добавить пользователя
        </ActionButton>
      </ActionBar>

      <Table>
        <thead>
          <tr>
            <TableHeader>Имя</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Роль</TableHeader>
            <TableHeader>Регистрация</TableHeader>
            <TableHeader>Действия</TableHeader>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(u => (
            <TableRow key={u.id}>
              <TableCell>{u.name}</TableCell>
              <TableCell>{u.email || u.telegramId}</TableCell>
              <TableCell>{u.role}</TableCell>
              <TableCell>{u.registrationDate}</TableCell>
              <TableCell>
                <ActionButtons>
                  <IconButton onClick={() => handleEdit(u)}>
                    <FiEdit />
                  </IconButton>
                  <IconButton danger onClick={() => handleDelete(u)}>
                    <FiTrash2 />
                  </IconButton>
                </ActionButtons>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </>
  );

  const renderSettings = () => (
    <div>
      <h3>Настройки системы</h3>
      <p>Настройки админ панели находятся в разработке.</p>
    </div>
  );

  return (
    <AdminContainer>
      <Header>
        <Title>Админ панель</Title>
        <UserInfo>
          <span>Администратор: {user?.name || 'Админ'}</span>
        </UserInfo>
      </Header>

      <TabsContainer>
        <Tab active={activeTab === 'stats'} onClick={() => setActiveTab('stats')}>
          <FiBarChart3 /> Статистика
        </Tab>
        <Tab active={activeTab === 'books'} onClick={() => setActiveTab('books')}>
          <FiBook /> Книги
        </Tab>
        <Tab active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
          <FiUsers /> Пользователи
        </Tab>
        <Tab active={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>
          <FiSettings /> Настройки
        </Tab>
      </TabsContainer>

      <AnimatePresence mode="wait">
        <ContentArea
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'stats' && renderStats()}
          {activeTab === 'books' && renderBooksTable()}
          {activeTab === 'users' && renderUsersTable()}
          {activeTab === 'settings' && renderSettings()}
        </ContentArea>
      </AnimatePresence>

      <AnimatePresence>
        {showModal && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <ModalHeader>
                <ModalTitle>
                  {modalType === 'add' ? 'Добавить' : 'Редактировать'} {activeTab === 'books' ? 'книгу' : 'пользователя'}
                </ModalTitle>
                <CloseButton onClick={() => setShowModal(false)}>×</CloseButton>
              </ModalHeader>

              <Form onSubmit={handleSubmit}>
                {activeTab === 'books' ? (
                  <>
                    <FormGroup>
                      <Label>Название</Label>
                      <Input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Автор</Label>
                      <Input
                        type="text"
                        value={formData.author || ''}
                        onChange={(e) => setFormData({...formData, author: e.target.value})}
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Жанр</Label>
                      <Select
                        value={formData.genre || ''}
                        onChange={(e) => setFormData({...formData, genre: e.target.value})}
                        required
                      >
                        <option value="">Выберите жанр</option>
                        {libraryData?.genres?.map(genre => (
                          <option key={genre} value={genre}>{genre}</option>
                        ))}
                      </Select>
                    </FormGroup>
                    <FormGroup>
                      <Label>Год издания</Label>
                      <Input
                        type="number"
                        value={formData.year || ''}
                        onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Описание</Label>
                      <Textarea
                        value={formData.description || ''}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Количество страниц</Label>
                      <Input
                        type="number"
                        value={formData.pages || ''}
                        onChange={(e) => setFormData({...formData, pages: parseInt(e.target.value)})}
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Рейтинг</Label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={formData.rating || ''}
                        onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Иконка (emoji)</Label>
                      <Input
                        type="text"
                        value={formData.icon || ''}
                        onChange={(e) => setFormData({...formData, icon: e.target.value})}
                        required
                      />
                    </FormGroup>
                  </>
                ) : (
                  <>
                    <FormGroup>
                      <Label>Имя</Label>
                      <Input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Роль</Label>
                      <Select
                        value={formData.role || ''}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        required
                      >
                        <option value="user">Пользователь</option>
                        <option value="moderator">Модератор</option>
                        <option value="admin">Администратор</option>
                      </Select>
                    </FormGroup>
                  </>
                )}

                <FormActions>
                  <ActionButton type="button" onClick={() => setShowModal(false)}>
                    Отмена
                  </ActionButton>
                  <ActionButton type="submit" primary>
                    {modalType === 'add' ? 'Добавить' : 'Сохранить'}
                  </ActionButton>
                </FormActions>
              </Form>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </AdminContainer>
  );
};

export default AdminPanel;