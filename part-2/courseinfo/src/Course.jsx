const Course = props => {
  return (
    <div>
    <Header course={props.course.name} />
    <Content parts={props.course.parts} />
    <Total parts={props.course.parts} />
    </div>
  )

}

const Header = props => {
  return (
    <h1>{props.course}</h1>
  )
}

const Part = props => {
  return (
    <p>
      {props.name} {props.number}
    </p>
  )
}

const Content = props => {
  return (
  <div>
  {props.parts.map(part => 
  <Part key={part.id} name={part.name} number={part.exercises} />
  )}
  </div>
  )
}

const Total = props => {
  const total = props.parts.reduce((sum, part) => {
    console.log(sum, part);
    return sum + part.exercises;
  }, 0);  

  return (
    <p>total of {total} exercises</p>
  );
};

export default Course