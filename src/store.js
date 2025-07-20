import { ref, computed } from 'vue'
import questionsData from './data/questions.json'
import drugsData from './data/drugs.json'

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
    const showStats = ref(false)
    const stats = ref(JSON.parse(localStorage.getItem('pharmaTestStats')) || {})
    const questions = ref(questionsData)
    const drugs = ref(drugsData)

    // Получить вопросы для выбранного режима
    const getQuestionsForMode = (mode) => {
        switch (mode) {
            case 'order':
                return [...questions.value] // Все вопросы по порядку
            case 'random-20':
                return getWeightedRandomQuestions(20) // 20 случайных вопросов
            case 'random-10':
                return getWeightedRandomQuestions(10) // 10 случайных вопросов
            default:
                return [...questions.value]
        }
    }

    // Получить взвешенный случайный список вопросов
    const getWeightedRandomQuestions = (count) => {
        const scoredQuestions = questions.value.map(question => {
            const questionStats = stats.value[question.id] || { total: 0, correct: 0 }
            const total = questionStats.total
            const incorrect = total - questionStats.correct

            // Логика оценки:
            // 1. Приоритет неотвеченным вопросам
            // 2. Больший вес вопросам с ошибками
            // 3. Предпочтение реже задаваемым вопросам
            // 4. Небольшой случайный фактор
            const score =
                (total === 0 ? 100 : 0) +
                (incorrect * 10) +
                (total === 0 ? 0 : 50 / (total + 1)) +
                (Math.random() * 5)

            return { question, score }
        })

        // Сортировка по оценке и выбор нужного количества
        scoredQuestions.sort((a, b) => b.score - a.score)
        return scoredQuestions.slice(0, count).map(item => item.question)
    }

    // Начать тест
    const startTest = (mode) => {
        currentMode.value = mode
        shuffledQuestions.value = getQuestionsForMode(mode)
        currentQuestionIndex.value = 0
        selectedAnswers.value = []
        results.value = []
        testStarted.value = true
        testFinished.value = false
        showAnswerResult.value = false
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
            testFinished.value = true // Устанавливаем флаг завершения теста
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
            stats.value[questionId] = { total: 0, correct: 0 }
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
            questionIds: shuffledQuestions.value.map(q => q.id),
            results: results.value.map(r => ({
                questionId: r.questionId,
                selected: r.selected,
                isCorrect: r.isCorrect
            })),
            finished: testFinished.value,
            showAnswerResult: showAnswerResult.value,
            darkMode: darkMode.value
        }
        localStorage.setItem('pharmaTestProgress', JSON.stringify(progress))
    }

    // Восстановить прогресс
    const restoreProgress = () => {
        const progress = JSON.parse(localStorage.getItem('pharmaTestProgress'))
        if (progress) {
            currentMode.value = progress.mode
            currentQuestionIndex.value = progress.index
            // Восстанавливаем полные объекты вопросов
            shuffledQuestions.value = progress.questionIds
                .map(id => questions.value.find(q => q.id === id))
                .filter(q => q !== undefined)
            results.value = progress.results || []
            testFinished.value = progress.finished
            showAnswerResult.value = progress.showAnswerResult || false
            darkMode.value = progress.darkMode || false
            testStarted.value = true

            // Если вопросы не найдены, завершаем тест
            if (shuffledQuestions.value.length === 0) {
                finishTest()
            }
        }
    }

    // Переключить тему
    const toggleDarkMode = () => {
        darkMode.value = !darkMode.value
        localStorage.setItem('darkMode', darkMode.value)
        saveProgress()
    }

    // Показать изображение
    const showImage = (id) => {
        modalImage.value = `./images/${id}`
    }

    // Закрыть модальное окно
    const closeModal = () => {
        modalImage.value = null
    }

    // Перезапустить тест
    const restartTest = () => {
        if (currentMode.value) {
            shuffledQuestions.value = getQuestionsForMode(currentMode.value)
        }
        currentQuestionIndex.value = 0
        selectedAnswers.value = []
        results.value = []
        testFinished.value = false // Сбрасываем флаг
        showAnswerResult.value = false
        saveProgress()
    }

    // Завершить тест
    const finishTest = () => {
        testStarted.value = false
        testFinished.value = false // Сбрасываем флаг
        currentQuestionIndex.value = 0
        selectedAnswers.value = []
        results.value = []
        showAnswerResult.value = false
        saveProgress()
    }

    // Показать статистику
    const showStatsModal = () => {
        showStats.value = true
    }

    const closeStatsModal = () => {
        showStats.value = false
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

    // Количество вопросов в текущем тесте
    const currentTestQuestionsCount = computed(() => {
        return shuffledQuestions.value.length
    })

    // Общее количество вопросов
    const totalQuestionsCount = computed(() => questions.value.length)

    // Прогресс теста
    const testProgress = computed(() => {
        return {
            current: currentQuestionIndex.value + 1,
            total: currentTestQuestionsCount.value
        }
    })

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
        showStats,
        questions,
        drugs,
        startTest,
        answerQuestion,
        nextQuestion,
        restartTest,
        restoreProgress,
        toggleDarkMode,
        showImage,
        closeModal,
        finishTest,
        showStatsModal,
        closeStatsModal,
        currentQuestion,
        shuffledAnswers,
        totalQuestionsCount,
        currentTestQuestionsCount,
        testProgress,
        allQuestions: questions,
        allDrugs: drugs
    }
}