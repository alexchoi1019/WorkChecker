document.addEventListener('DOMContentLoaded', function() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        alert('로그인이 필요합니다!');
        window.location.href = 'index.html';
        return;
    }

    // 사용자별 tasks 키 생성
    const userTasksKey = `tasks_${currentUser}`;

    // 별점 관련 변수와 버튼들
    const starButtons = document.querySelectorAll('.star-btn');
    let currentRating = 0;

    // 기능 버튼들
    const saveBtn = document.getElementById('saveBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const viewTasksBtn = document.getElementById('viewTasksBtn');
    const viewCalendarBtn = document.getElementById('viewCalendarBtn');
    const editBtn = document.getElementById('editBtn');
    const modal = document.getElementById('taskModal');
    const taskSelect = document.getElementById('taskSelect');
    const selectTaskBtn = document.getElementById('selectTaskBtn');
    const cancelTaskBtn = document.getElementById('cancelTaskBtn');

    // 별점 기능
    starButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            if (currentRating === index + 1) {
                // 같은 별을 다시 클릭하면 초기화
                currentRating = 0;
            } else {
                // 다른 별을 클릭하면 해당 별점으로 설정
                currentRating = index + 1;
            }
            updateStars();
        });

        button.addEventListener('mouseover', () => {
            highlightStars(index);
        });

        button.addEventListener('mouseout', () => {
            updateStars();
        });
    });

    function updateStars() {
        starButtons.forEach((button, index) => {
            button.textContent = index < currentRating ? '★' : '☆';
        });
    }

    function highlightStars(index) {
        starButtons.forEach((button, i) => {
            button.textContent = i <= index ? '★' : '☆';
        });
    }

    // 저장 버튼
    saveBtn.addEventListener('click', function() {
        const task = document.getElementById('task').value;
        const year = document.querySelector('input[placeholder="년"]').value;
        const month = document.querySelector('input[placeholder="월"]').value;
        const day = document.querySelector('input[placeholder="일"]').value;
        let hour = parseInt(document.querySelector('input[placeholder="시"]').value);
        const minute = document.querySelector('input[placeholder="분"]').value;
        const ampm = document.getElementById('ampm').value;

        if (!task || !year || !month || !day || !hour || !minute) {
            alert('모든 필드를 입력해주세요!');
            return;
        }

        if (ampm === 'PM' && hour < 12) {
            hour += 12;
        } else if (ampm === 'AM' && hour === 12) {
            hour = 0;
        }

        const deadline = new Date(year, month-1, day, hour, minute);
        
        let tasks = JSON.parse(localStorage.getItem(userTasksKey) || '[]');
        
        tasks.push({
            task: task,
            rating: currentRating,
            deadline: deadline.getTime(),
            deadlineString: `${year}년 ${month}월 ${day}일 ${ampm} ${hour % 12 || 12}시 ${minute}분`
        });

        localStorage.setItem(userTasksKey, JSON.stringify(tasks));
        
        alert('저장되었습니다!');
        clearForm();
    });

    // 삭제 버튼
    deleteBtn.addEventListener('click', function() {
        const task = document.getElementById('task').value;
        if (!task) {
            alert('삭제할 할 일을 입력해주세요!');
            return;
        }

        let tasks = JSON.parse(localStorage.getItem(userTasksKey) || '[]');
        const taskIndex = tasks.findIndex(t => t.task === task);

        if (taskIndex === -1) {
            alert('해당하는 할 일을 찾을 수 없습니다.');
            return;
        }

        if (confirm('정말 삭제하시겠습니까?')) {
            tasks.splice(taskIndex, 1);
            localStorage.setItem(userTasksKey, JSON.stringify(tasks));
            clearForm();
            alert('삭제되었습니다.');
        }
    });

    // 전체 할 일 보기 버튼
    viewTasksBtn.addEventListener('click', function() {
        window.location.href = 'schedule.html';
    });

    // 전체 일정 보기 버튼
    viewCalendarBtn.addEventListener('click', function() {
        window.location.href = 'calendar.html';
    });

    // 수정 버튼
    editBtn.addEventListener('click', function() {
        const tasks = JSON.parse(localStorage.getItem(userTasksKey) || '[]');
        
        taskSelect.innerHTML = '<option value="">선택하세요</option>';
        
        tasks.forEach((task, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${task.task} (${task.deadlineString})`;
            taskSelect.appendChild(option);
        });
        
        modal.style.display = 'block';
    });

    // 할 일 선택 시
    selectTaskBtn.addEventListener('click', function() {
        const selectedIndex = taskSelect.value;
        if (!selectedIndex) {
            alert('수정할 할 일을 선택해주세요.');
            return;
        }

        const tasks = JSON.parse(localStorage.getItem(userTasksKey) || '[]');
        const selectedTask = tasks[selectedIndex];

        // 폼에 선택된 할 일 정보 채우기
        document.getElementById('task').value = selectedTask.task;
        
        const deadline = new Date(selectedTask.deadline);
        document.querySelector('input[placeholder="년"]').value = deadline.getFullYear();
        document.querySelector('input[placeholder="월"]').value = deadline.getMonth() + 1;
        document.querySelector('input[placeholder="일"]').value = deadline.getDate();
        document.querySelector('input[placeholder="시"]').value = deadline.getHours() % 12 || 12;
        document.querySelector('input[placeholder="분"]').value = deadline.getMinutes().toString().padStart(2, '0');
        document.getElementById('ampm').value = deadline.getHours() >= 12 ? 'PM' : 'AM';
        
        currentRating = selectedTask.rating;
        updateStars();

        // 선택된 할 일 삭제
        tasks.splice(selectedIndex, 1);
        localStorage.setItem(userTasksKey, JSON.stringify(tasks));

        modal.style.display = 'none';
    });

    // 취소 버튼 클릭 시
    cancelTaskBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // 폼 초기화 함수
    function clearForm() {
        document.getElementById('task').value = '';
        document.querySelector('input[placeholder="년"]').value = '';
        document.querySelector('input[placeholder="월"]').value = '';
        document.querySelector('input[placeholder="일"]').value = '';
        document.querySelector('input[placeholder="시"]').value = '';
        document.querySelector('input[placeholder="분"]').value = '';
        document.getElementById('ampm').value = 'AM';
        currentRating = 0;
        updateStars();
    }

    // 날짜 입력 필드들의 유효성 검사
    function validateDateInputs() {
        const year = document.getElementById('year');
        const month = document.getElementById('month');
        const day = document.getElementById('day');
        const hour = document.getElementById('hour');
        const minute = document.getElementById('minute');

        // 년도 검사
        year.addEventListener('input', function() {
            let value = parseInt(this.value);
            if (value < 2024) this.value = 2024;
            if (value > 2100) this.value = 2100;
        });

        // 월 검사
        month.addEventListener('input', function() {
            let value = parseInt(this.value);
            if (value < 1) this.value = 1;
            if (value > 12) this.value = 12;
        });

        // 일 검사 (월에 따라 동적으로 변경)
        day.addEventListener('input', function() {
            let value = parseInt(this.value);
            let maxDays = new Date(year.value, month.value, 0).getDate();
            if (value < 1) this.value = 1;
            if (value > maxDays) this.value = maxDays;
        });

        // 시간 검사
        hour.addEventListener('input', function() {
            let value = parseInt(this.value);
            if (value < 1) this.value = 1;
            if (value > 12) this.value = 12;
        });

        // 분 검사
        minute.addEventListener('input', function() {
            let value = parseInt(this.value);
            if (value < 0) this.value = 0;
            if (value > 59) this.value = 59;
        });

        // 월이 변경될 때 일(day) 최대값 조정
        month.addEventListener('change', function() {
            let maxDays = new Date(year.value, this.value, 0).getDate();
            if (parseInt(day.value) > maxDays) {
                day.value = maxDays;
            }
            day.max = maxDays;
        });
    }

    validateDateInputs();
}); 