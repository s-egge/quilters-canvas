import { Button, Text, Modal, Flex, Divider } from '@mantine/core'
import { useState } from 'react'

export default function DeletePatternButton({
  title,
  description,
  disabled,
  onDelete,
}: {
  title: string
  description: string
  disabled: boolean
  onDelete: () => void
}) {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <>
      <Modal
        opened={open}
        onClose={() => setOpen(false)}
        title="Delete Pattern"
        size="sm"
      >
        <Flex direction="column" gap="xs">
          <Text fw={600}>{title}</Text>
          <Text size="xs">{description}</Text>
        </Flex>
        <Divider mt="xs" mb="xs" />
        <Text size="sm" mb="xs">
          Are you sure you want to delete this pattern from the browser? This
          action cannot be undone, the pattern will be lost unless saved
          elsewhere.
        </Text>
        <Flex justify="center">
          <Button
            onClick={() => {
              setOpen(false)
              onDelete()
            }}
            color="red"
          >
            Confirm Delete Pattern
          </Button>
        </Flex>
      </Modal>
      <Button disabled={disabled} onClick={() => setOpen(true)} color="red">
        Delete
      </Button>
    </>
  )
}
