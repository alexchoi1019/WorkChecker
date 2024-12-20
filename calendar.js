class Calendar {
    constructor() {
        this.currentUser = localStorage.getItem('currentUser');
        if (!this.currentUser) {
            alert('로그인이 필요합니다!');
            window.location.href = 'index.html';
            return;
        }

        this.userTasksKey = `tasks_${this.currentUser}`;
        this.date = new Date();
        this.currentMonth = this.date.getMonth();
        this.currentYear = this.date.getFullYear();
        this.tasks = JSON.parse(localStorage.getItem(this.userTasksKey) || '[]');
        
        this.initializeCalendar();
        this.addEventListeners();
    }

    initializeCalendar() {
        this.updateMonthDisplay();
        this.renderCalendar();
    }

    addEventListeners() {
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.changeMonth(-1);
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.changeMonth(1);
        });

        document.getElementById('header-back-btn').addEventListener('click', () => {
            window.history.back();
        });
    }

    changeMonth(delta) {
        this.currentMonth += delta;
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        } else if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        this.updateMonthDisplay();
        this.renderCalendar();
    }

    updateMonthDisplay() {
        const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월",
                          "7월", "8월", "9월", "10월", "11월", "12월"];
        document.getElementById('currentMonth').textContent = 
            `${this.currentYear}년 ${monthNames[this.currentMonth]}`;
    }

    renderCalendar() {
        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const startingDay = firstDay.getDay();
        const totalDays = lastDay.getDate();

        let calendarBody = document.getElementById('calendarBody');
        calendarBody.innerHTML = '';

        let date = 1;
        for (let i = 0; i < 6; i++) {
            let row = document.createElement('tr');
            
            for (let j = 0; j < 7; j++) {
                let cell = document.createElement('td');
                
                if (i === 0 && j < startingDay) {
                    cell.classList.add('other-month');
                    const prevMonthLastDay = new Date(this.currentYear, this.currentMonth, 0).getDate();
                    cell.textContent = prevMonthLastDay - (startingDay - j - 1);
                } else if (date > totalDays) {
                    cell.classList.add('other-month');
                    cell.textContent = date - totalDays;
                    date++;
                } else {
                    const dateContainer = document.createElement('div');
                    dateContainer.className = 'date-container';
                    
                    const dateText = document.createElement('span');
                    dateText.textContent = date;
                    dateContainer.appendChild(dateText);

                    const currentDate = new Date(this.currentYear, this.currentMonth, date);
                    const events = this.tasks.filter(task => {
                        const taskDate = new Date(task.deadline);
                        return taskDate.getDate() === currentDate.getDate() &&
                               taskDate.getMonth() === currentDate.getMonth() &&
                               taskDate.getFullYear() === currentDate.getFullYear();
                    });

                    if (events.length > 0) {
                        const dotContainer = document.createElement('div');
                        dotContainer.className = 'dot-container';

                        const dot = document.createElement('div');
                        dot.className = `event-dot importance-${events[0].importance}`;
                        
                        dot.addEventListener('click', (e) => {
                            e.stopPropagation();
                            this.showTaskDetails(events, dot);
                        });

                        dotContainer.appendChild(dot);
                        dateContainer.appendChild(dotContainer);
                    }

                    cell.appendChild(dateContainer);
                    date++;
                }
                row.appendChild(cell);
            }
            calendarBody.appendChild(row);
            if (date > totalDays) break;
        }
    }

    showTaskDetails(events, dotElement) {
        const existingTooltip = document.querySelector('.task-details-tooltip');
        
        if (existingTooltip && existingTooltip.getAttribute('data-dot-id') === dotElement.id) {
            existingTooltip.remove();
            return;
        }

        if (existingTooltip) {
            existingTooltip.remove();
        }

        if (!dotElement.id) {
            dotElement.id = 'dot-' + Date.now();
        }

        const tooltip = document.createElement('div');
        tooltip.className = 'task-details-tooltip';
        tooltip.setAttribute('data-dot-id', dotElement.id);

        const eventsHTML = events.map(event => {
            const eventDate = new Date(event.deadline);
            let hours = eventDate.getHours();
            const minutes = eventDate.getMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;

            return `
                <div class="event-item">
                    <p><strong>할 일:</strong> ${event.task}</p>
                    <p><strong>시간:</strong> ${ampm} ${hours}:${minutes}</p>
                    <p><strong>중요도:</strong> ${event.importance}</p>
                    <p><strong>상태:</strong> ${event.completed ? '완료' : '미완료'}</p>
                </div>
            `;
        }).join('<hr>');

        tooltip.innerHTML = `
            <div class="tooltip-header">일정 목록</div>
            <div class="tooltip-content">
                ${eventsHTML}
            </div>
            <div class="tooltip-footer">
                <button class="close-tooltip">닫기</button>
            </div>
        `;

        const rect = dotElement.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        tooltip.style.position = 'absolute';
        tooltip.style.top = `${rect.bottom + scrollTop + 5}px`;
        tooltip.style.left = `${rect.left + scrollLeft}px`;

        document.body.appendChild(tooltip);
        const tooltipRect = tooltip.getBoundingClientRect();
        
        if (tooltipRect.right > window.innerWidth) {
            tooltip.style.left = `${window.innerWidth - tooltipRect.width - 10 + scrollLeft}px`;
        }

        if (tooltipRect.bottom > window.innerHeight) {
            tooltip.style.top = `${rect.top + scrollTop - tooltipRect.height - 5}px`;
        }

        tooltip.querySelector('.close-tooltip').addEventListener('click', () => {
            tooltip.remove();
        });

        document.addEventListener('click', (e) => {
            if (!tooltip.contains(e.target) && e.target !== dotElement) {
                tooltip.remove();
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Calendar();
}); 