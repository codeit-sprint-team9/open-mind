import {
  BottomContainer,
  MainContainer,
  OptionMenuContainer,
  OptionMenuItem,
  PostCardContainer,
  PostCardWrapper,
  TitleContainer,
} from './PostCardStyledComponents'
import OptionIcon from '../../asset/postCard/img_option.svg'
import { useCallback, useState } from 'react'
import Badge from '../common/Badge'
import InputTextArea from '../common/InputTextArea'
import Button from '../common/Button'
import Reaction from '../common/Reaction'
import Edit from '../common/Edit'
import { darkMode } from '../../recoil/theme'
import { useRecoilValue } from 'recoil'
import useAsync from '../../hooks/useAsync'
import {
  deleteAnswers,
  getQuestions,
  postAnswers,
  postReactions,
  putAnswers,
} from '../../api/postCard'
import moment from 'moment'
import { debounce } from 'lodash'
import Loading from '../common/Loading'
import 'moment/locale/ko'

const calculateTimeAgo = (createdAt) => {
  const diff = moment(createdAt).fromNow()
  return diff
}

const PostCard = ({ state, data, handleDeleteQuestion }) => {
  const [cardData, setCardData] = useState(data)
  const [isOpenOption, setIsOpenOption] = useState(false)
  const [answer, setAnswer] = useState(
    cardData.answer
      ? cardData.answer.isRejected
        ? ''
        : cardData.answer.content
      : ''
  )
  const isAnswered = cardData.answer ? true : false
  const [isEdit, setIsEdit] = useState(false)

  const userInfo = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : 0

  const [isLoadingReactions, , postReactionsAsync] = useAsync(postReactions)
  const [isLoadingAnswers, , postAnswersAsync] = useAsync(postAnswers)
  const [isLoadingPutAnswers, , putAnswersAsync] = useAsync(putAnswers)
  const [isLoadingDeleteAnswers, , deleteAnswersAsync] = useAsync(deleteAnswers)
  const [, , getQuestionsAsync] = useAsync(getQuestions)

  const handleGetQuestion = async () => {
    const response = await getQuestionsAsync(data.id)
    if (!response) return
    setCardData(response)
    setAnswer(
      response.answer
        ? response.answer.isRejected
          ? ''
          : response.answer.content
        : ''
    )
  }

  // 답변 등록, 답변 수정
  const handlePostAnswer = async (isRejected = false) => {
    // 답변 수정

    if (isAnswered) {
      const result = await putAnswersAsync(
        cardData.answer.id,
        answer,
        isRejected
      )

      if (!result) return

      handleGetQuestion()
      setIsEdit(false)
      return
    }

    if (answer !== '' || isRejected) {
      const result = await postAnswersAsync(
        cardData.id,
        isRejected ? 'rejected' : answer,
        isRejected
      )

      if (!result) return
      handleGetQuestion()
      return
    }
  }

  const delayedApi = useCallback(
    debounce((q) => handleReactions(q), 300),
    []
  )

  // 리액션
  const handleReactions = async (type) => {
    const result = await postReactionsAsync(type, cardData.id)

    if (!result) return
    handleGetQuestion()
  }

  // option 버튼 - 답변 삭제, 답변 수정, 질문 삭제
  const handleOptions = async (menu) => {
    setIsOpenOption(false)
    if (menu === '답변 거절') {
      handlePostAnswer(true)
      return
    }
    if (menu === '답변 삭제') {
      await deleteAnswersAsync(cardData.answer.id)

      handleGetQuestion()
      return
    }
    if (menu === '질문 삭제') {
      handleDeleteQuestion(cardData.id)
      return
    }
    if (menu === '수정하기') {
      setIsEdit(true)
      return
    }
  }

  if (isLoadingDeleteAnswers) {
    return (
      <PostCardWrapper>
        <PostCardContainer>
          <Loading />
        </PostCardContainer>
      </PostCardWrapper>
    )
  }
  const theme = useRecoilValue(darkMode)

  return (
    <PostCardWrapper onClick={() => setIsOpenOption(false)}>
      <PostCardContainer $theme={theme}>
        <div className="header-container">
          <Badge isAnswered={isAnswered} />
          {state === 'answer' && (
            <img
              className="option-btn"
              src={OptionIcon}
              alt="optionIcon"
              onClick={(e) => {
                e.stopPropagation()
                setIsOpenOption(!isOpenOption)
              }}
            />
          )}
        </div>

        <TitleContainer $theme={theme}>
          <div className="question-ago">
            질문 · {calculateTimeAgo(cardData.createdAt)}
          </div>

          <div className="title">{cardData.content}</div>
        </TitleContainer>

        {!(state === 'default' && !isAnswered) && (
          <MainContainer $isAnswered={isAnswered} $theme={theme}>
            <img
              src={userInfo.imageSource}
              className="user-icon"
              alt="userIcon"
            />
            <div className="main-content-container">
              <div className="content-user-info-container">
                <div className="user-name">{userInfo.name}</div>
                <div className="content-ago">
                  {calculateTimeAgo(cardData.answer?.createdAt)}
                </div>
              </div>

              {isAnswered && !isEdit ? (
                <>
                  {cardData.answer.isRejected ? (
                    <div className="answerRejected">답변 거절</div>
                  ) : (
                    <div className="main-content">
                      {cardData.answer.content}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {isLoadingAnswers || isLoadingPutAnswers ? (
                    <div className="loadingContainer">
                      <Loading />
                    </div>
                  ) : (
                    <>
                      <div className="textarea-container">
                        <InputTextArea
                          placeholder="답변을 입력해주세요"
                          setAnswer={setAnswer}
                          answer={answer}
                          onKeyDown={handlePostAnswer}
                        />
                        <Button
                          onClick={() => handlePostAnswer()}
                          isValue={answer !== ''}
                          brown={true}
                          text="답변 완료"
                        />
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </MainContainer>
        )}

        <div className="divider" />

        <BottomContainer>
          {!isLoadingReactions ? (
            <Reaction
              like={cardData.like}
              disLike={cardData.dislike}
              onClick={delayedApi}
            />
          ) : (
            <div className="loadingContainer">
              <Loading />
            </div>
          )}

          {isAnswered && state === 'answer' && <Edit onClick={handleOptions} />}
        </BottomContainer>
      </PostCardContainer>

      {isOpenOption && (
        <OptionMenu
          onClick={handleOptions}
          setIsOpenOption={setIsOpenOption}
          isAnswered={isAnswered}
          isRejected={cardData.answer?.isRejected || false}
        />
      )}
    </PostCardWrapper>
  )
}
export default PostCard

const OptionMenuArr = ['답변 거절', '답변 삭제', '질문 삭제', '수정하기']

const OptionMenu = ({ onClick, isAnswered, isRejected }) => {
  return (
    <OptionMenuContainer>
      {OptionMenuArr.map((e, index) => {
        return (
          <OptionMenuItem
            key={index}
            $display={
              !isAnswered
                ? e === '답변 삭제' || e === '수정하기'
                  ? false
                  : true
                : e === '수정하기' || (isRejected && e === '답변 거절')
                ? false
                : true
            }
            $isEdit={e === '수정하기'}
            className="optionMenuItem"
            onClick={() => onClick(e)}
          >
            {e}
          </OptionMenuItem>
        )
      })}
    </OptionMenuContainer>
  )
}
