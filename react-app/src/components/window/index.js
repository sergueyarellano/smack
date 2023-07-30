import styled from 'styled-components'
import Draggable from 'react-draggable'
const Container = styled.div`
  display: ${props => props.$display ? 'grid' : 'none'};
  grid-template-rows: 1rem 1fr; 
  grid-column: ${props => props.$column};
  grid-row: ${props => props.$row};
  overflow: auto;
  resize: both;
  min-width: 130px;
  min-height: 180px;
`

const Title = styled.label`
  font-size: small;
  background-color: var(--greyLight);
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
