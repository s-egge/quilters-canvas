import { Modal, Button, Text, Title, Divider, Space } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

export default function UnderConstruction() {
  const [opened, { open, close }] = useDisclosure(true)

  return (
    <Modal
      size="lg"
      opened={opened}
      onClose={close}
      centered
      withCloseButton={false}
    >
      <Title order={1} ta="center">
        Under Construction!
      </Title>
      <Space h="md" />
      <Divider />
      <Space h="md" />
      <Text>
        This website is a work in progress. You can still look around, but it
        won't be fully functional for a while. You can learn more about it on{' '}
        <a href="https://github.com/s-egge/quilt-design-app">GitHub</a>.
      </Text>
      <Space h="md" />
      <Button onClick={close} fullWidth aria-label="Close modal">
        {' '}
        Close{' '}
      </Button>
    </Modal>
  )
}
