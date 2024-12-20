const quotes = [
    {
        text: "내일은 오늘보다 더 바쁠 것이다. 오늘 내가 할 수 있는 것을 내일로 미루지 마라.",
        author: "벤자민 프랭클린"
    },
    {
        text: "밉도록 귀찮은 일을 벌레와 같이 끊임없이 먹어내라",
        author: "마틴 루터 킹 주니어"
    },
    {
        text: "하고 싶지 않은 일에도 솔선수범하는 것은 결국 자신을 성장시키는 길이다",
        author: "월드 디즈니"
    },
    {
        text: "시간을 가치 있게 사용하자. 여가 시간도 힘든 문제를 해결하는 데 도움이 되기 때문이다.",
        author: "토마스 에디슨"
    },
    {
        text: "어려움 속에서도 기회를 찾아내는 것이 성공의 비결이다.",
        author: "헬렌 켈러"
    },
    {
        text: "시작이 반이다",
        author: "아리스토텔레스"
    },
    {
        text: "두려움을 이기는 것은 성공에 가장 빠른 방법이다.",
        author: "스티브 잡스"
    },
    {
        text: "세 가지 힘 : 인내, 헌신, 겸손.",
        author: "마훗마 간디"
    },
    {
        text: "나의 철학은 망설이지 말고, 감당할 수 있는 한 빠르게 올라가자.",
        author: "존 F. 케네디"
    },
    {
        text: "목표에 도달하려면, 행동하지 않으면 안 된다.",
        author: "넬슨 만델라"
    },
    {
        text: "넘어지더라도 전진하는 방향으로 넘어져라.",
        author: "오프라 윈프리"
    },
    {
        text: "천재성은 열정과 독창성의 결합이다.",
        author: "아인슈타인"
    },
    {
        text: "어려울수록 도전적인 상황에서 더 나은 결과를 얻을 수 있다.",
        author: "베토벤"
    },
    {
        text: "집중은 성공의 건축가다. 목표를 끈질기게 추짐함으로써 성공의 기초를 다진다.",
        author: "앤드류 카네기"
    }
];

function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
}

function updateQuote() {
    const quote = getRandomQuote();
    const footerQuote = document.querySelector('footer');
    footerQuote.innerHTML = `"${quote.text}" - ${quote.author}`;
}

// 페이지 로드 시 명언 표시
document.addEventListener('DOMContentLoaded', updateQuote); 