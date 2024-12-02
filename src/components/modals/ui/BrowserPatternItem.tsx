import { Flex, Text, Button } from '@mantine/core'
import DeletePatternButton from './DeletePatternButton'
export default function SavedPatternItem({
  pattern,
  customButtonText,
  onCustomButtonClick,
  onDeletePattern,
}: {
  pattern: any
  customButtonText: string
  onCustomButtonClick: () => void
  onDeletePattern: () => void
}) {
  const title = pattern.canvas?.title ? pattern.canvas.title : 'Empty'
  const desc = pattern.canvas?.description
    ? pattern.canvas.description
    : 'No description'
  const deleteDisabled = title === 'Empty'
  const customButtonDisabled = customButtonText === 'Load' && title === 'Empty'

  return (
    <Flex
      justify="space-between"
      align="flex-start"
      mb="xs"
      style={{
        border: '1px solid black',
        borderRadius: 5,
        padding: 5,
        borderColor:
          'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-6))',
        boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.1)',
      }}
    >
      <Flex direction="column" gap="xs">
        <Text fw={600}>{title}</Text>
        <Text size="xs">{desc}</Text>
      </Flex>
      <Flex direction="column" gap="xs">
        <Button disabled={customButtonDisabled} onClick={onCustomButtonClick}>
          {customButtonText}
        </Button>
        <DeletePatternButton
          title={title}
          description={desc}
          onDelete={onDeletePattern}
          disabled={deleteDisabled}
        />
      </Flex>
    </Flex>
  )
}
