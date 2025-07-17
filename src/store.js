import {ref, computed} from 'vue'
import questions from './data/questions.json'

export const store = () => {
    // Состояние
    const currentMode = ref(null)
    const currentQuestionIndex = ref(0)
    const selectedAnswers = ref([])
    const testStarted = ref(false)
    const testFinished = ref(false)
    const results = ref([])
    const shuffledQuestions = ref([])
    const showAnswerResult = ref(false)
    const darkMode = ref(localStorage.getItem('darkMode') === 'true' || false)
    const modalImage = ref(null)

    // Статистика
    const stats = ref(JSON.parse(localStorage.getItem('pharmaTestStats')) || {})

    // Получить вопросы
    const getQuestionsForMode = (mode) => {
        if (mode === 'order') {
            return [...questions]
        } else {
            const shuffled = [...questions].sort(() => 0.5 - Math.random())
            return shuffled.slice(0, 2)
        }
    }

    // Начать тест
    const startTest = (mode) => {
        currentMode.value = mode
        shuffledQuestions.value = getQuestionsForMode(mode)
        testStarted.value = true
        saveProgress()
    }

    // Ответить на вопрос
    const answerQuestion = () => {
        const question = shuffledQuestions.value[currentQuestionIndex.value]
        const isCorrect = checkAnswer(question, selectedAnswers.value)

        results.value.push({
            questionId: question.id,
            selected: [...selectedAnswers.value],
            isCorrect
        })

        updateStats(question.id, isCorrect)
        showAnswerResult.value = true
        saveProgress()
    }

    // Перейти к следующему вопросу
    const nextQuestion = () => {
        showAnswerResult.value = false
        selectedAnswers.value = []

        if (currentQuestionIndex.value < shuffledQuestions.value.length - 1) {
            currentQuestionIndex.value++
        } else {
            testFinished.value = true
        }

        saveProgress()
    }

    // Проверить ответ
    const checkAnswer = (question, selected) => {
        if (question.answer_type === 'single') {
            return selected.length === 1 &&
                question.correct_answers.includes(selected[0])
        } else {
            return selected.length === question.correct_answers.length &&
                selected.every(ans => question.correct_answers.includes(ans))
        }
    }

    // Обновить статистику
    const updateStats = (questionId, isCorrect) => {
        if (!stats.value[questionId]) {
            stats.value[questionId] = {total: 0, correct: 0}
        }

        stats.value[questionId].total++
        if (isCorrect) {
            stats.value[questionId].correct++
        }

        localStorage.setItem('pharmaTestStats', JSON.stringify(stats.value))
    }

    // Сохранить прогресс

    const saveProgress = () => {
        const progress = {
            mode: currentMode.value,
            index: currentQuestionIndex.value,
            // Сохраняем только ID вопросов и ответов
            questionIds: shuffledQuestions.value.map(q => q.id),
            results: results.value.map(r => ({
                questionId: r.questionId,
                selected: r.selected,
                isCorrect: r.isCorrect
            })),
            finished: testFinished.value,
            showAnswerResult: showAnswerResult.value,
            darkMode: darkMode.value
        };
        localStorage.setItem('pharmaTestProgress', JSON.stringify(progress));
    };

    // Восстановить прогресс
    const restoreProgress = () => {
        const progress = JSON.parse(localStorage.getItem('pharmaTestProgress'));
        if (progress) {
            currentMode.value = progress.mode;
            currentQuestionIndex.value = progress.index;

            // Восстанавливаем вопросы из исходного списка по ID
            shuffledQuestions.value = progress.questionIds
                .map(id => questions.find(q => q.id === id))
                .filter(q => q !== undefined);

            // Восстанавливаем результаты
            results.value = progress.results || [];
            testFinished.value = progress.finished;
            showAnswerResult.value = progress.showAnswerResult || false;
            darkMode.value = progress.darkMode || false;
            testStarted.value = true;
        }
    };

    // Переключить тему
    const toggleDarkMode = () => {
        darkMode.value = !darkMode.value
        localStorage.setItem('darkMode', darkMode.value)
        saveProgress()
    }

    // Показать изображение
    const showImage = (id) => {
        modalImage.value = `/images/${id}`
    }

    // Закрыть модальное окно
    const closeModal = () => {
        modalImage.value = null
    }

    // Перезапустить тест
    const restartTest = () => {
        currentQuestionIndex.value = 0
        selectedAnswers.value = []
        results.value = []
        testFinished.value = false
        showAnswerResult.value = false
        saveProgress()
    }

    // Текущий вопрос
    const currentQuestion = computed(() => {
        return shuffledQuestions.value[currentQuestionIndex.value]
    })

    // Перемешанные варианты ответов
    const shuffledAnswers = computed(() => {
        if (!currentQuestion.value) return []
        return [...currentQuestion.value.answers].sort(() => 0.5 - Math.random())
    })

    const finishTest = () => {
        testStarted.value = false
        testFinished.value = false
        currentQuestionIndex.value = 0
        selectedAnswers.value = []
        results.value = []
        showAnswerResult.value = false
        saveProgress()
    }

    return {
        currentMode,
        currentQuestionIndex,
        selectedAnswers,
        testStarted,
        testFinished,
        results,
        stats,
        showAnswerResult,
        darkMode,
        modalImage,
        startTest,
        answerQuestion,
        nextQuestion,
        restartTest,
        restoreProgress,
        toggleDarkMode,
        showImage,
        closeModal,
        currentQuestion,
        shuffledAnswers,
        finishTest
    }
}