document.addEventListener('DOMContentLoaded', function() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        alert('로그인이 필요합니다!');
        window.location.href = 'index.html';
        return;
    }

    const userTasksKey = `tasks_${currentUser}`;
    let tasks = JSON.parse(localStorage.getItem(userTasksKey) || '[]');

    function checkExpiredTasks() {
        const currentTime = new Date().getTime();
        const expiredTasks = tasks.filter(task => new Date(task.deadline).getTime() < currentTime);
        
        if (expiredTasks.length > 0) {
            const expiredTaskNames = expiredTasks.map(task => task.task).join('\n- ');
            const confirmMessage = `다음 할 일들의 기한이 지났습니다:\n- ${expiredTaskNames}\n\n삭제하시겠습니까?`;
            
            if (confirm(confirmMessage)) {
                tasks = tasks.filter(task => new Date(task.deadline).getTime() >= currentTime);
                localStorage.setItem(userTasksKey, JSON.stringify(tasks));
                updateTaskList();
                updateGraph();
                alert('기한이 지난 할 일들이 삭제되었습니다.');
            }
        }
    }

    function updateTaskList() {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';

        const currentTime = new Date().getTime();

        tasks.forEach((task, index) => {
            const row = document.createElement('tr');
            
            const checkboxCell = document.createElement('td');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'task-checkbox';
            checkbox.checked = task.completed || false;
            checkbox.addEventListener('change', () => {
                task.completed = checkbox.checked;
                localStorage.setItem(userTasksKey, JSON.stringify(tasks));
                updateTaskList();
                if (isGraphVisible) {
                    updateGraph();
                }
            });
            checkboxCell.appendChild(checkbox);
            
            const isExpired = new Date(task.deadline).getTime() < currentTime;
            
            const cells = [
                index + 1,
                '★'.repeat(task.rating) + '☆'.repeat(5 - task.rating),
                task.task,
                task.deadlineString
            ].map(content => {
                const cell = document.createElement('td');
                cell.textContent = content;
                if (task.completed) {
                    cell.classList.add('completed-task');
                }
                if (isExpired) {
                    cell.classList.add('expired-task');
                }
                return cell;
            });

            row.appendChild(checkboxCell);
            cells.forEach(cell => row.appendChild(cell));
            taskList.appendChild(row);
        });
    }

    const graphArea = document.getElementById('graphArea');
    const showGraphBtn = document.getElementById('showGraphBtn');
    let isGraphVisible = false;

    function updateGraph() {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        const percentage = total > 0 ? (completed / total) * 100 : 0;

        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');

        if (total === 0) {
            progressBar.style.width = '100%';
            progressBar.style.backgroundColor = '#cccccc';
            progressText.textContent = '해야할 일이 없습니다.';
        } else {
            progressBar.style.width = `${percentage}%`;
            progressBar.style.backgroundColor = '#4CAF50';
            progressText.textContent = `${Math.round(percentage)}% 완료`;
        }
    }

    showGraphBtn.addEventListener('click', () => {
        isGraphVisible = !isGraphVisible;
        if (isGraphVisible) {
            graphArea.style.display = 'block';
            showGraphBtn.textContent = '완수률 숨기기';
            updateGraph();
        } else {
            graphArea.style.display = 'none';
            showGraphBtn.textContent = '완수률 보기';
        }
    });

    checkExpiredTasks();
    
    setInterval(checkExpiredTasks, 60000);

    updateTaskList();
}); 
