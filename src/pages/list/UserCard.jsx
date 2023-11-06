import styled from 'styled-components'
import messageIcon from '../../asset/list/Messages.svg'
import profileImage from '../../asset/list/profileImg.svg'
import { device } from '../../components/styles'
const CardContainer = styled.div`
  display: flex;
  width: 220px;
  height: 187px;
  padding: 20px;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 16px;
  border: 1px solid var(--gray-40);
  @media ${device.mobile} {
    padding: 16px;
  }
`

const CardProfile = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-self: stretch;

  img {
    width: 60px;
    height: 60px;
  }

  div {
    color: var(--gray-60);
    font-size: 20px;

    font-weight: 400;
    line-height: 25px;
  }

  @media ${device.mobile} {
    img {
      width: 48px;
      height: 48px;
    }

    div {
      font-size: 18px;
    }
  }
`

const CardContent = styled.div`
  display: flex;
  justify-content: space-between;

  color: var(--gray-40);
  font-size: 16px;

  line-height: 22px;
  img {
    margin-right: 4px;
  }
  div {
    font-family: Pretendard;
    text-align: center;
    display: flex;
  }

  @media ${device.mobile} {
    font-size: 14px;
  }
`

const CardListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
`

function CardList() {
  return (
    <CardListContainer>
      <UserCard />
      <UserCard />
      <UserCard />
      <UserCard />
      <UserCard />
      <UserCard />
      <UserCard />
      <UserCard />
    </CardListContainer>
  )
}
function UserCard() {
  return (
    <CardContainer>
      <CardProfile>
        <img src={profileImage} />
        <div>아초는 고양이</div>
      </CardProfile>

      <CardContent>
        <div>
          <img src={messageIcon} />
          <span>받은 질문</span>
        </div>
        <div>9개</div>
      </CardContent>
    </CardContainer>
  )
}

export default CardList
