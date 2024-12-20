document.getElementById("startBtn").addEventListener("click", () => {
    const nickname = document.getElementById("nickname").value;
    if (nickname) {
      window.location.href = "task.html";
    } else {
      alert("닉네임을 입력하세요.");
    }
  });
  