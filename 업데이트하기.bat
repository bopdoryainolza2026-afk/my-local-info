@echo off
setlocal enabledelayedexpansion

echo.
echo ==========================================
echo 🚀 홈페이지 최신 내용 반영을 시작합니다...
echo ==========================================
echo.

echo [1/4] 변경된 파일들을 모으는 중...
git add .

echo.
echo [2/4] 업데이트 메시지 작성 중...
git commit -m "사이트 업데이트 (%date% %time%)"

echo.
echo [3/4] 깃허브에서 최신 내용 가져오는 중...
git pull --rebase origin main

echo.
echo [4/4] 깃허브로 최종 전송 중...
git push origin main

echo.
echo ==========================================
echo ✨ 반영이 완료되었습니다!
echo 🌐 약 3~5분 후 홈페이지에서 확인하세요.
echo ==========================================
pause
