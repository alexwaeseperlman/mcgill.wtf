import React, { useState } from 'react';

import {
  Alert,
  AlertIcon,
  Box,
  Center,
  Container,
  Flex,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Stack,
  Text,
  Wrap,
} from '@chakra-ui/react';

import { SearchIcon } from '@chakra-ui/icons';

type Payload = {
  time: number;
  courses: [Course];
};

type Course = {
  id: string;
  title: string;
  subject: string;
  code: string;
  level: string;
  url: string;
  department: string;
  faculty: string;
  faculty_url: string;
  terms: [string];
  description: string;
  instructors: string;
};

const App: React.ElementType = () => {
  const [payload, setPayload] = useState<Payload | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [value, setValue] = useState<string>('');

  const handleChange = async (event: any) => {
    try {
      const value = event.target.value;
      setValue(value);
      setPayload(await (await fetch('/search?query=' + value)).json());
    } catch (error) {
      let message = 'Unknown Error';
      if (error instanceof Error) message = error.message;
      setError(message);
    }
  };

  return (
    <Center padding='1em'>
      <Stack alignItems='center' width='50%'>
        <Wrap>
          <Heading as='h1' size='2xl'>
            mcgill.wtf
          </Heading>
          <Image src='./src/assets/mcgill.png' width='4em' />
        </Wrap>
        <Text>
          A low-latency full-text search of mcgill's entire course catalog
        </Text>
        <Text>
          Try queries like{' '}
          <Text as='span' fontWeight='bold'>
            @subject:comp
          </Text>
          ,{' '}
          <Text as='span' fontWeight='bold'>
            @code:251
          </Text>
          ,{' '}
          <Text as='span' fontWeight='bold'>
            @level:&#123;undergraduate&#125;
          </Text>
        </Text>
        <InputGroup>
          <InputLeftElement
            pointerEvents='none'
            children={<SearchIcon color='gray.300' />}
          />
          <Input
            placeholder='Search for a course'
            value={value}
            onChange={(event) => handleChange(event)}
          />
        </InputGroup>
        <Stack alignItems='right' width='100%'>
          {payload && (
            <Alert status='success'>
              <AlertIcon />
              Found {payload.courses.length} results ({payload.time} ms)
            </Alert>
          )}
          {error && (
            <Alert status='error'>
              <AlertIcon />
              error: {error}
            </Alert>
          )}
          {payload &&
            payload.courses.map((course: Course, _: number) => {
              return (
                <Flex>
                  <Box ml='3'>
                    <Text fontWeight='bold'>
                      <Link href={course.url} isExternal>
                        {course.subject} {course.code}: {course.title}
                      </Link>
                    </Text>
                    <Text fontSize='sm'>
                      <Link href={course.faculty_url} isExternal>
                        {course.faculty}
                      </Link>{' '}
                      | {course.department} | {course.level} |{' '}
                      {course.terms.join(', ')}
                    </Text>
                    <Text fontSize='sm'>{course.description}</Text>
                    <Text fontSize='sm'>{course.instructors}</Text>
                  </Box>
                </Flex>
              );
            })}
        </Stack>
      </Stack>
    </Center>
  );
};

export default App;
