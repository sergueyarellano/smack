import styled from 'styled-components'
import Draggable from 'react-draggable'
const Container = styled.div`
  display: ${props => props.$display ? 'grid' : 'none'};
  grid-template-rows: 1.5rem 1fr;
  grid-column: ${props => props.$column};
  grid-row: ${props => props.$row};
  overflow: hidden;
  resize: both;
  min-width: 130px;
  min-height: 180px;
  /* From https://css.glass */
  background: rgba(255, 255, 255, 0.08);
  border-radius: 0 0 13px 13px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(1px);
  -webkit-backdrop-filter: blur(3.1px);
  border: 1px solid rgba(255, 255, 255, 0.14);
}
`

const Title = styled.label`
  font-size: 0.6rem;
  border: 1px var(--white) solid;
  padding-left: 3px;
  font-weight: bold;
  color: var(--green);
`

export default function Window ({ children, isVisible = true, title, row = '1', column = '1' }) {
  return (
    <Draggable handle='.handle'>
      <Container $display={isVisible} $row={row} $column={column}>
        <Title className='handle'>{title}</Title>
        {children}
      </Container>
    </Draggable>

  )
}
