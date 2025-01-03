const Header = ({ course }) => <h2>{course}</h2>

const Total = ({ parts }) => 
  <p>Total of {parts.map(part =>
    part.exercises).reduce((a, exercises) => a + exercises, 0)
    } exercises
  </p>

const Part = ({ part }) =>
  <p>
    {part.name} {part.exercises}
  </p>


const Content = ({ parts }) => 
  <>
    {parts.map(part => 
      <Part key={part.id} part={part} />)
    }
  </>


const Course = ({ course }) =>
  <div>
    <Header course={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>

export default Course