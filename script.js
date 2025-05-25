document.addEventListener('DOMContentLoaded', () => {
    // Elementos del Menú Lateral
    const openMenuBtn = document.getElementById('openMenuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const sideMenu = document.getElementById('sideMenu');
    const mainContent = document.getElementById('mainContent');

    // Elementos de la vista de año
    const yearView = document.getElementById('yearView');
    const monthView = document.getElementById('monthView');
    const currentYear = document.getElementById('currentYear');
    const monthsGrid = document.getElementById('monthsGrid');
    const prevYearBtn = document.getElementById('prevYearBtn');
    const nextYearBtn = document.getElementById('nextYearBtn');
    const backToYearBtn = document.getElementById('backToYearBtn');

    // Elementos de la vista de mes
    const currentMonthYear = document.getElementById('currentMonthYear');
    const calendarDays = document.getElementById('calendarDays');
    const prevMonthBtn = document.getElementById('prevMonthBtn');
    const nextMonthBtn = document.getElementById('nextMonthBtn');
    const eventModal = document.getElementById('eventModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const saveEventBtn = document.getElementById('saveEventBtn');
    const selectedDateEl = document.getElementById('selectedDate');
    const eventTextEl = document.getElementById('eventText');
    const eventListEl = document.getElementById('eventList');

    let currentDate = new Date();
    let events = JSON.parse(localStorage.getItem('calendarEvents')) || {};
    let currentlySelectedDate = null;

    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const gauklerProductsKey = 'gauklerProducts';

    // Categorías fijas
    const gauklerCategories = [
        "Promociones",
        "Cervezas",
        "Tragos",
        "Tapeos",
        "Pizzas",
        "Milanesas",
        "Burger",
        "Wraps",
        "Lomitos"
    ];
    let gauklerProducts = JSON.parse(localStorage.getItem(gauklerProductsKey)) || [];

    const categoryFilterSelect = document.getElementById('categoryFilterSelect');
    const productCategorySelect = document.getElementById('productCategorySelect');
    const addProductForm = document.getElementById('addProductForm');
    const productNameInput = document.getElementById('productName');
    const productDescriptionInput = document.getElementById('productDescription');
    const productPriceInput = document.getElementById('productPrice');
    const productPhotoUrlInput = document.getElementById('productPhotoUrl');
    const productListContainer = document.getElementById('productListContainer');

    // Función para renderizar la vista de año completo (12 meses)
    function renderYearView() {
        const year = currentDate.getFullYear();
        currentYear.textContent = year;
        monthsGrid.innerHTML = '';
        
        // Renderizar cada uno de los 12 meses
        for (let month = 0; month < 12; month++) {
            const monthCard = document.createElement('div');
            monthCard.classList.add('month-card');
            monthCard.dataset.month = month;
            
            // Título del mes
            const monthTitle = document.createElement('h3');
            monthTitle.textContent = monthNames[month];
            monthCard.appendChild(monthTitle);
            
            // Mini calendario del mes
            const miniGrid = document.createElement('div');
            miniGrid.classList.add('month-mini-grid');
            
            // Calcular primer día del mes y días totales
            const firstDayOfMonth = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            
            // Añadir días vacíos al inicio
            for (let i = 0; i < firstDayOfMonth; i++) {
                const emptyDay = document.createElement('div');
                emptyDay.classList.add('month-mini-day', 'empty');
                miniGrid.appendChild(emptyDay);
            }
            
            // Añadir los días del mes
            const today = new Date();
            for (let day = 1; day <= daysInMonth; day++) {
                const miniDay = document.createElement('div');
                miniDay.classList.add('month-mini-day');
                miniDay.textContent = day;
                
                // Formatear la fecha para buscar eventos
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                
                // Marcar el día de hoy
                if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                    miniDay.classList.add('today');
                }
                
                // Marcar días con eventos
                if (events[dateStr] && events[dateStr].length > 0) {
                    miniDay.classList.add('has-event');
                }
                
                miniGrid.appendChild(miniDay);
            }
            
            monthCard.appendChild(miniGrid);
            
            // Añadir evento de clic para ver el mes completo
            monthCard.addEventListener('click', () => {
                showMonthView(month);
            });
            
            monthsGrid.appendChild(monthCard);
        }
    }
    
    // Función para mostrar la vista de mes individual
    function showMonthView(month) {
        currentDate.setMonth(month);
        yearView.classList.add('hidden');
        monthView.classList.remove('hidden');
        renderCalendar();
    }
    
    // Función para volver a la vista de año
    function showYearView() {
        yearView.classList.remove('hidden');
        monthView.classList.add('hidden');
        renderYearView();
    }

    // Función para renderizar el calendario mensual
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        currentMonthYear.textContent = `${monthNames[month]} ${year}`;
        calendarDays.innerHTML = '';

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Rellenar días vacíos al inicio del mes
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('day', 'empty');
            calendarDays.appendChild(emptyCell);
        }

        // Rellenar los días del mes
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('day');
            dayCell.textContent = day;
            dayCell.dataset.date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            const today = new Date();
            if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                dayCell.classList.add('today');
            }

            if (events[dayCell.dataset.date] && events[dayCell.dataset.date].length > 0) {
                dayCell.classList.add('has-event');
            }

            dayCell.addEventListener('click', () => openEventModal(dayCell.dataset.date));
            calendarDays.appendChild(dayCell);
        }
    }

    function openEventModal(dateStr) {
        currentlySelectedDate = dateStr;
        const [year, month, day] = dateStr.split('-');
        selectedDateEl.textContent = `Fecha: ${day}/${month}/${year}`;
        eventTextEl.value = ''; // Limpiar textarea
        loadEventsForDate(dateStr);
        eventModal.style.display = 'flex';
    }

    function closeEventModal() {
        eventModal.style.display = 'none';
        currentlySelectedDate = null;
    }

    function saveEvent() {
        const eventDescription = eventTextEl.value.trim();
        if (!eventDescription || !currentlySelectedDate) return;

        if (!events[currentlySelectedDate]) {
            events[currentlySelectedDate] = [];
        }
        events[currentlySelectedDate].push(eventDescription);
        localStorage.setItem('calendarEvents', JSON.stringify(events));
        
        eventTextEl.value = ''; // Limpiar después de guardar
        loadEventsForDate(currentlySelectedDate);
        renderCalendar(); // Re-renderizar para mostrar el indicador de evento si es nuevo
    }

    function loadEventsForDate(dateStr) {
        eventListEl.innerHTML = '';
        if (events[dateStr] && events[dateStr].length > 0) {
            events[dateStr].forEach((eventDesc, index) => {
                const eventDiv = document.createElement('div');
                eventDiv.textContent = eventDesc;
                // Opcional: Añadir botón para eliminar evento
                // const deleteBtn = document.createElement('button');
                // deleteBtn.textContent = 'Eliminar';
                // deleteBtn.onclick = () => deleteEvent(dateStr, index);
                // eventDiv.appendChild(deleteBtn);
                eventListEl.appendChild(eventDiv);
            });
        }
    }

    function saveGauklerProducts() {
        localStorage.setItem(gauklerProductsKey, JSON.stringify(gauklerProducts));
    }

    function renderProducts() {
        productListContainer.innerHTML = ''; // Limpiar lista actual
        const selectedCategory = categoryFilterSelect.value;

        const productsToDisplay = selectedCategory === 'all' 
            ? gauklerProducts 
            : gauklerProducts.filter(p => p.category === selectedCategory);

        if (productsToDisplay.length === 0) {
            productListContainer.innerHTML = '<p>No hay productos para mostrar en esta categoría.</p>';
            return;
        }

        productsToDisplay.forEach((product, index) => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            card.innerHTML = `
                <img src="${product.photoUrl || 'https://via.placeholder.com/250x180.png?text=Sin+Imagen'}" alt="${product.name}">
                <h4>${product.name}</h4>
                <p class="category-tag">${product.category}</p>
                ${product.description ? `<p class="description">${product.description}</p>` : ''}
                <p class="price">Precio: $${parseFloat(product.price).toFixed(2)}</p>
                <div class="actions">
                    <button class="delete" data-product-id="${product.id}">Eliminar</button>
                </div>
            `;
            productListContainer.appendChild(card);
        });
        attachProductActionListeners();
    }

    function handleAddProduct(event) {
        event.preventDefault();
        const name = productNameInput.value.trim();
        const description = productDescriptionInput.value.trim();
        const category = productCategorySelect.value;
        const price = parseFloat(productPriceInput.value);
        const photoUrl = productPhotoUrlInput.value.trim();

        if (!name || !category || isNaN(price)) {
            alert('Por favor, completa todos los campos requeridos correctamente.');
            return;
        }
        
        // Verificar si el producto ya existe (por nombre)
        if (gauklerProducts.some(p => p.name.toLowerCase() === name.toLowerCase())) {
            alert('Un producto con este nombre ya existe.');
            return;
        }

        const newProduct = {
            id: 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9), // ID único
            name,
            description,
            category,
            price,
            photoUrl
        };
        gauklerProducts.push(newProduct);
        saveGauklerProducts();
        renderProducts();
        addProductForm.reset();
    }

    function handleDeleteProduct(event) {
        if (!event.target.classList.contains('delete')) return;
        const productId = event.target.dataset.productId;
        const productToDelete = gauklerProducts.find(p => p.id === productId);
        if (!productToDelete) return; // No se encontró el producto

        if (confirm(`¿Estás seguro de que quieres eliminar el producto "${productToDelete.name}"?`)) {
            gauklerProducts = gauklerProducts.filter(p => p.id !== productId);
            saveGauklerProducts();
            renderProducts();
        }
    }

    function attachProductActionListeners() {
        productListContainer.removeEventListener('click', handleDeleteProduct); // Evitar duplicados
        //productListContainer.removeEventListener('click', handleEditProduct); // Si se implementa editar
        productListContainer.addEventListener('click', handleDeleteProduct);
        // productListContainer.addEventListener('click', handleEditProduct);
    }

    function initGauklerMenu() {
        renderProducts();
        // Configurar event listeners
        addProductForm.addEventListener('submit', handleAddProduct);
        categoryFilterSelect.addEventListener('change', renderProducts);
    }

    // Event listeners para la vista de mes
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    // Event listeners para la vista de año
    prevYearBtn.addEventListener('click', () => {
        currentDate.setFullYear(currentDate.getFullYear() - 1);
        renderYearView();
    });

    nextYearBtn.addEventListener('click', () => {
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        renderYearView();
    });

    // Botón para volver a la vista de año desde la vista de mes
    backToYearBtn.addEventListener('click', showYearView);

    closeModalBtn.addEventListener('click', closeEventModal);
    saveEventBtn.addEventListener('click', saveEvent);

    // Cerrar modal si se hace clic fuera del contenido
    window.addEventListener('click', (event) => {
        if (event.target === eventModal) {
            closeEventModal();
        }
    });

    // Iniciar con la vista de año completo
    renderYearView();

    // Funcionalidad del Menú Lateral
    function openNav() {
        sideMenu.style.width = "250px"; // Ancho del menú al abrir
        if (mainContent) { // Asegurarse que mainContent existe
            mainContent.style.marginLeft = "250px";
        }
        if (document.body) { // Para el body si no se usa mainContent directamente para el margen
            document.body.style.marginLeft = "250px";
        }
    }

    function closeNav() {
        sideMenu.style.width = "0";
        if (mainContent) {
            mainContent.style.marginLeft = "0";
        }
        if (document.body) {
            document.body.style.marginLeft = "0";
        }
    }

    if(openMenuBtn) openMenuBtn.addEventListener('click', openNav);
    if(closeMenuBtn) closeMenuBtn.addEventListener('click', closeNav);

    // Manejar clics en los enlaces del menú para cambiar de vista
    const menuLinks = sideMenu.getElementsByTagName('a');
    const viewSections = document.querySelectorAll('.view-section');

    // --- Lógica para el Menú Diario ---
    const dailyMenuDataKey = 'dailyMenuData';
    let dailyMenuData = JSON.parse(localStorage.getItem(dailyMenuDataKey)) || {};

    function saveDailyMenuData() {
        localStorage.setItem(dailyMenuDataKey, JSON.stringify(dailyMenuData));
    }

    function renderStaffList(day) {
        const staffListContainer = document.getElementById(`${day}StaffList`);
        if (!staffListContainer) return;
        staffListContainer.innerHTML = ''; // Limpiar lista actual

        if (dailyMenuData[day] && dailyMenuData[day].staff) {
            dailyMenuData[day].staff.forEach((person, index) => {
                const entry = document.createElement('div');
                entry.classList.add('staff-entry');
                entry.innerHTML = `
                    <span>${person.name}</span>
                    <span>${person.preference}</span>
                    <button class="delete-staff-btn" data-day="${day}" data-index="${index}">Eliminar</button>
                `;
                staffListContainer.appendChild(entry);
            });
        }
        // Añadir event listeners a los nuevos botones de eliminar
        attachDeleteStaffButtonListeners();
    }

    function loadDailyMenuData() {
        document.querySelectorAll('.day-menu-card').forEach(card => {
            const day = card.dataset.day;
            if (dailyMenuData[day]) {
                // Cargar comida del día
                const mealInput = card.querySelector('.meal-of-the-day');
                if (mealInput) {
                    mealInput.value = dailyMenuData[day].meal || '';
                }
                // Renderizar lista de personal
                renderStaffList(day);
            }
        });
    }

    function handleAddStaff(event) {
        const day = event.target.dataset.day;
        const card = document.querySelector(`.day-menu-card[data-day="${day}"]`);
        if (!card) return;

        const nameInput = card.querySelector('.add-staff-form .staff-name');
        const preferenceInput = card.querySelector('.add-staff-form .staff-preference');

        const name = nameInput.value.trim();
        const preference = preferenceInput.value.trim();

        if (name && preference) {
            if (!dailyMenuData[day]) {
                dailyMenuData[day] = { meal: '', staff: [] };
            }
            if (!dailyMenuData[day].staff) {
                dailyMenuData[day].staff = [];
            }
            dailyMenuData[day].staff.push({ name, preference });
            saveDailyMenuData();
            renderStaffList(day);
            nameInput.value = '';
            preferenceInput.value = '';
        } else {
            alert('Por favor, ingresa el nombre del personal y su preferencia.');
        }
    }

    function handleDeleteStaff(event) {
        const day = event.target.dataset.day;
        const index = parseInt(event.target.dataset.index, 10);

        if (dailyMenuData[day] && dailyMenuData[day].staff && dailyMenuData[day].staff[index]) {
            dailyMenuData[day].staff.splice(index, 1);
            saveDailyMenuData();
            renderStaffList(day);
        }
    }

    function handleSaveDay(event) {
        const day = event.target.dataset.day;
        const card = document.querySelector(`.day-menu-card[data-day="${day}"]`);
        if (!card) return;

        const mealInput = card.querySelector('.meal-of-the-day');
        if (!dailyMenuData[day]) {
            dailyMenuData[day] = { meal: '', staff: [] };
        }
        dailyMenuData[day].meal = mealInput.value.trim();
        saveDailyMenuData();
        alert(`Datos de ${day.charAt(0).toUpperCase() + day.slice(1)} guardados.`);
    }

    // Asignar event listeners a los botones de "Añadir Personal"
    document.querySelectorAll('.add-staff-btn').forEach(button => {
        button.addEventListener('click', handleAddStaff);
    });

    // Asignar event listeners a los botones de "Guardar Día"
    document.querySelectorAll('.save-day-btn').forEach(button => {
        button.addEventListener('click', handleSaveDay);
    });
    
    // Función para (re)asignar listeners a botones de eliminar personal (necesario tras re-renderizar)
    function attachDeleteStaffButtonListeners() {
        document.querySelectorAll('.delete-staff-btn').forEach(button => {
            // Remover listener antiguo para evitar duplicados si ya existe
            button.removeEventListener('click', handleDeleteStaff); 
            button.addEventListener('click', handleDeleteStaff);
        });
    }

    // Cargar datos del menú diario cuando la vista del menú diario se muestre
    // Esto se puede mejorar observando cambios en la clase 'hidden' de #menuDiarioView
    // Por ahora, lo cargamos una vez al inicio y cuando se guarda algo.
    // Si se navega fuera y se vuelve, los datos deberían persistir por localStorage.
    loadDailyMenuData(); 
    
    // --- Lógica para la integración de Google Sheets en la sección Stock ---
    const sheetsUrlInput = document.getElementById('sheetsUrl');
    const addSheetsBtn = document.getElementById('addSheetsBtn');
    const refreshSheetsBtn = document.getElementById('refreshSheetsBtn');
    const sheetsEmbedContainer = document.getElementById('sheetsEmbedContainer');
    const noSheetsMessage = document.getElementById('noSheetsMessage');
    
    // Clave para almacenar la URL de la planilla en localStorage
    const sheetsUrlKey = 'googleSheetsUrl';
    
    // Cargar URL guardada al iniciar
    function loadSavedSheetsUrl() {
        const savedUrl = localStorage.getItem(sheetsUrlKey);
        if (savedUrl) {
            sheetsUrlInput.value = savedUrl;
            embedGoogleSheet(savedUrl);
        }
    }
    
    // Función para convertir URL de Google Sheets a URL de embed
    function getEmbedUrl(url) {
        // Verificar si es una URL válida de Google Sheets
        if (!url || !url.includes('docs.google.com/spreadsheets')) {
            return null;
        }
        
        // Extraer el ID de la hoja de cálculo
        let sheetId = '';
        
        // Formato: https://docs.google.com/spreadsheets/d/SHEET_ID/edit...
        const match = url.match(/\/d\/([^\/]+)/);
        if (match && match[1]) {
            sheetId = match[1];
            // Crear URL para embeber
            return `https://docs.google.com/spreadsheets/d/${sheetId}/pubhtml?widget=true&headers=false`;
        }
        
        return null;
    }
    
    // Función para embeber la hoja de cálculo
    function embedGoogleSheet(url) {
        const embedUrl = getEmbedUrl(url);
        
        if (!embedUrl) {
            alert('Por favor, ingresa una URL válida de Google Sheets.');
            return;
        }
        
        // Ocultar mensaje de no hay planilla
        if (noSheetsMessage) {
            noSheetsMessage.style.display = 'none';
        }
        
        // Eliminar iframe existente si hay alguno
        const existingIframe = sheetsEmbedContainer.querySelector('iframe');
        if (existingIframe) {
            sheetsEmbedContainer.removeChild(existingIframe);
        }
        
        // Crear nuevo iframe
        const iframe = document.createElement('iframe');
        iframe.src = embedUrl;
        iframe.title = 'Google Sheets - Inventario';
        iframe.setAttribute('allowfullscreen', true);
        
        // Añadir iframe al contenedor
        sheetsEmbedContainer.appendChild(iframe);
        
        // Guardar URL en localStorage
        localStorage.setItem(sheetsUrlKey, url);
    }
    
    // Event listener para el botón de añadir planilla
    if (addSheetsBtn) {
        addSheetsBtn.addEventListener('click', () => {
            const url = sheetsUrlInput.value.trim();
            if (url) {
                embedGoogleSheet(url);
            } else {
                alert('Por favor, ingresa la URL de una planilla de Google Sheets.');
            }
        });
    }
    
    // Event listener para el botón de actualizar datos
    if (refreshSheetsBtn) {
        refreshSheetsBtn.addEventListener('click', () => {
            const url = sheetsUrlInput.value.trim();
            if (url) {
                embedGoogleSheet(url);
            } else {
                alert('No hay ninguna planilla para actualizar. Por favor, ingresa una URL primero.');
            }
        });
    }
    
    // Cargar planilla guardada al iniciar
    loadSavedSheetsUrl();
    
    // Inicializar el menú Gaukler
    initGauklerMenu();
    // -------------------------------------

    for (let link of menuLinks) {
        if (link.id !== 'closeMenuBtn') { // No aplicar al botón de cerrar
            link.addEventListener('click', function(event) {
                // event.preventDefault(); // Descomentar si los href son solo para JS y no para anclas reales

                // Ocultar todas las secciones
                viewSections.forEach(section => {
                    section.classList.add('hidden');
                });

                // Mostrar la sección correspondiente al href del enlace
                // Asumimos que href="#nombre" corresponde a un div con id="nombreView"
                const targetViewId = this.getAttribute('href').substring(1) + "View";
                const targetView = document.getElementById(targetViewId);
                if (targetView) {
                    targetView.classList.remove('hidden');
                }
                
                closeNav(); // Cerrar el menú después de la selección
            });
        }
    }
});
