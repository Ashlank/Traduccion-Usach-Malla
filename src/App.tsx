import { useState, useMemo } from 'react'
import { getData, saveData } from './utils/functions.ts'
import DATA from './data/data.json'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

type Subjects = {
  id: number,
  semester: number,
  name: string,
  prerequisites: number[] | []
}

export default function App() {
  const [approvedSubjects, setapprovedSubjects] = useState<number[]>(getData)

  // Array of semesters
  const allSemester: number[] = useMemo(() => {
    return DATA.reduce<number[]>((acc, curr) => {
      if(!acc.includes(curr.semester)) acc.push(curr.semester);
      return acc
    }, [])
  }, [])

  const semesterData = useMemo(() => {
    return allSemester.map((semester) => {
      const semesterSubjects = DATA.filter((subject) => subject.semester === semester)
      return {
        semester,
        semesterSubjects
      }
    })
  }, [allSemester])

  const toggleSubjectApproval = (subject: Subjects) => {
    if(approvedSubjects.includes(subject.id)) {
      setapprovedSubjects(prev => {
        const newState = [...prev.filter(el => el !== subject.id)]
        saveData(newState)
        return newState
      })
    } else if(subject.prerequisites.every(el => approvedSubjects.includes(el))) {
      setapprovedSubjects(prev => {
        const newState = [...prev, subject.id]
        saveData(newState)
        return newState
      })
    }
  }

  return (
    <div className='flex flex-col'>
      <CardTitle className='text-center p-4'>LICENCIATURA EN LINGUÍSTICA APLICADA A LA TRADUCCIÓN INGLÉS - JAPONÉS E INGLÉS PORTUGUÉS | <b>USACH</b></CardTitle>
      <div className='flex flex-col sm:flex-row gap-8 overflow-auto'>
        {
          semesterData.map(({ semester, semesterSubjects}) => {
            return ( 
              <Semester key={semester} subjects={semesterSubjects} approvedSubjects={approvedSubjects} toggleSubjectApproval={toggleSubjectApproval} />
            )
          })
        }
      </div>
      <footer>
        <p className='font-semibold text-center'>Hecho con ❤️ por Ashlank</p>
      </footer>
    </div>
  )
}

type SemesterProps = {
  subjects: Subjects[],
  approvedSubjects: number[],
  toggleSubjectApproval: (parameter: Subjects) => void
}
export function Semester({ subjects, approvedSubjects, toggleSubjectApproval }: SemesterProps) {
  return (
    <Card className='bg-card text-card-foreground flex flex-col min-w-xs text-center py-3 gap-3'>
      <CardHeader>
        <CardTitle>
          { subjects[0].semester + '° Semestre' }
        </CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-3 px-4'>
        {
          subjects.map(( subject ) => {
            return (
              <Subject key={subject.id} subject={subject} approvedSubjects={approvedSubjects} toggleSubjectApproval={toggleSubjectApproval} />
            )
          })
        }
      </CardContent>
    </Card>
  )
}

function Subject({ subject, approvedSubjects, toggleSubjectApproval }: { subject: Subjects, approvedSubjects: number[], toggleSubjectApproval: (p: Subjects) => void }) {
  const isPrerequisitesapprovedSubjects = subject.prerequisites.every(el => approvedSubjects.includes(el));
  const isapprovedSubjects = approvedSubjects.includes(subject.id)

  const defaultStyles = 'bg-card text-card-foreground p-3 border border-border shadow-sm hover:shadow-lg shadow-accent'
  const blockedStyles = 'bg-muted text-muted-foreground opacity-60 cursor-not-allowed shadow-none'
  const unblockedStyles = 'bg-secondary text-secondary-foreground opacity-100 cursor-pointer'
  const approvedSubjectsStyles = 'bg-primary text-primary-foreground cursor-pointer'
  
  const getStyles = () => {
    if(isapprovedSubjects) return approvedSubjectsStyles
    if(isPrerequisitesapprovedSubjects) return unblockedStyles
    return blockedStyles
  }

  return (
    <Card
      onClick={() => toggleSubjectApproval(subject)}
      className={`${defaultStyles} ${getStyles()}`}
    >
      {subject.name}
    </Card>
  )
}