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

        // 중요도 표시 부분을 수정
        const importanceStars = '★'.repeat(event.importance) + '☆'.repeat(5 - event.importance);

        return `
            <div class="event-item">
                <p><strong>할 일:</strong> ${event.task}</p>
                <p><strong>시간:</strong> ${ampm} ${hours}:${minutes}</p>
                <p><strong>중요도:</strong> ${importanceStars}</p>
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
