import React, { useState } from 'react'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import { mockWordFindQuestions } from '../../mock/wordFind.js'

export default function WordFindGame() {
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)

  const question = mockWordFindQuestions[index % mockWordFindQuestions.length]
  const isLast = index === mockWordFindQuestions.length - 1

  const handleAnswer = (option) => {
    if (feedback) return
    const correct = option === question.correct
    setFeedback(correct ? 'correct' : 'wrong')
    if (correct) setScore((s) => s + 10)
  }

  const nextQuestion = () => {
    setFeedback(null)
    setIndex((i) => (i + 1) % mockWordFindQuestions.length)
  }

  const restart = () => {
    setIndex(0)
    setScore(0)
    setFeedback(null)
  }

  return (
    <div className="patient-screen min-h-screen bg-offwhite dark:bg-bg-dark transition-colors duration-300 p-6 flex flex-col gap-5">
      <PageHeader
        title="Word Find"
        backTo="/patient/games"
        voiceText={`${question.question} Your score is ${score}.`}
      />

      <p className="text-lg text-charcoal dark:text-text-dark text-center -mt-2">Score: {score}</p>

      <Card className="text-center rounded-3xl bg-white dark:bg-surface-dark max-w-md mx-auto w-full">
        <p className="font-display text-xl font-medium text-charcoal dark:text-text-dark mb-6">
          {question.question}
        </p>
        <div className="grid grid-cols-2 gap-4">
          {question.options.map((opt) => {
            const isCorrectOpt = opt === question.correct
            const showState = feedback && (isCorrectOpt || opt === question.picked)
            return (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                disabled={!!feedback}
                className={`aspect-square rounded-2xl text-5xl flex items-center justify-center shadow-md transition-all active:scale-95 ${
                  feedback && isCorrectOpt
                    ? 'bg-sage/30 dark:bg-sage-dark/30 ring-4 ring-sage dark:ring-sage-dark'
                    : 'bg-teal/10 dark:bg-teal-dark/10'
                }`}
              >
                {opt}
              </button>
            )
          })}
        </div>

        {feedback && (
          <div className="mt-5">
            <p className={`font-bold ${feedback === 'correct' ? 'text-sage dark:text-sage-dark' : 'text-alertamber dark:text-amber-dark'}`}>
              {feedback === 'correct' ? 'That\'s right! 🎉' : `Good try! The answer was ${question.correct}`}
            </p>
            {isLast ? (
              <Button fullWidth className="mt-3" onClick={restart}>Play Again</Button>
            ) : (
              <Button fullWidth className="mt-3" onClick={nextQuestion}>Next Question</Button>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
