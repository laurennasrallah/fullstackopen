import Course from './Course'

// const Content = props => {
//   return (
//     <div>
//       <Part name={props.parts[0].name} number={props.parts[0].exercises} />
//       <Part name={props.parts[1].name} number={props.parts[1].exercises} />
//       <Part name={props.parts[2].name} number={props.parts[2].exercises} />
//     </div>
//   )
// }


// const Total = props => {
//   return (
//     <p>Number of exercises {props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises}</p>
//   )
// }


const App = () => {
  const course = [
  {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      },
      {
        name: 'Redux',
        exercises: 11,
        id: 4
      }
    ]
  },
  {
    name: 'Node.js',
    id: 2,
    parts: [
      {
        name: 'Routing',
        exercises: 3,
        id:1
      },
      {
        name: 'Middlewares',
        exercises: 7,
        id: 2
      }
    ]
  }
]

  return (
  <div>
    {/* <Course course={course} /> */}
    {course.map(courses => 
    <Course key={courses.id} course={courses} />
    )}
  </div>
  )
}

export default App