import styled from 'styled-components'

const Container = styled.div`
  display: ${props => props.$display ? 'grid' : 'none'};
  grid-template-rows: 1rem 1fr; 
  grid-column: ${props => props.$column};
  grid-row: ${props => props.$row};
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
    <Container $display={isVisible} $row={row} $column={column}>
      <Title>{title}</Title>
      {children}
    </Container>

  )
}
