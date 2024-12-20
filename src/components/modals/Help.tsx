import { useAppDispatch, useAppSelector } from '@store/hooks'
import { toggleTool } from '@store/toolbarSlice'
import {
  Modal,
  Divider,
  Accordion,
  Flex,
  Text,
  Kbd,
  Space,
} from '@mantine/core'
import { toolbarItems } from '@components/toolbar/Tools'
import { Icon } from '@tabler/icons-react'
import classes from '@components/toolbar/Toolbar.module.css'

function ToolItem({
  name,
  shortcut,
  description,
  icon: Icon,
}: {
  name: string
  shortcut: string
  description: string
  icon: Icon
}) {
  return (
    <Flex direction="column" mb="sm">
      <Flex align="center">
        <Icon
          className={classes.tool}
          style={{
            width: 20,
            height: 20,
            pointerEvents: 'none',
          }}
        />

        <Space w="sm" />
        <Text size="lg">{name}</Text>
      </Flex>
      <Space h="xs" />
      <Flex>
        <Kbd
          style={{
            height: 'fit-content',
          }}
        >
          {shortcut}
        </Kbd>
        <Space w="sm" />
        <Text size="sm" c="gray" style={{ marginLeft: 10 }}>
          {description}
        </Text>
      </Flex>
      <Space h="sm" />
    </Flex>
  )
}

export default function Help() {
  const dispatch = useAppDispatch()
  const showModal = useAppSelector((state) => state.toolbar.help)

  if (!showModal) return null

  function onClose() {
    dispatch(toggleTool('help'))
  }

  return (
    <Modal opened={showModal} onClose={onClose} centered title="Help" size="md">
      <Accordion defaultValue="Tools">
        <Accordion.Item key="tools" value="Tools">
          <Accordion.Control>Tools</Accordion.Control>
          <Accordion.Panel>
            <Divider mb="xs" />
            {toolbarItems.map((item) => (
              <ToolItem
                icon={item.icon}
                name={item.name}
                shortcut={item.key}
                key={item.key}
                description={item.description ? item.description : ''}
              />
            ))}
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item key="about" value="About">
          <Accordion.Control>About</Accordion.Control>
          <Accordion.Panel>
            <Text>
              This is a web-based tool for designing quilt patterns before
              cutting in to your fabric. Currently, you can design quilts in
              gridded layouts of squares or hexagons. You can use plain colors,
              or upload images via URL or from your device. The images can be
              "scaled" so that they better represent what your cut piece of
              fabric will look like.
            </Text>
            <Space h="xs" />
            <Text>
              Patterns can be saved and loaded in both the browser and your
              local device. Patterns are saved with a custom file extension
              (.qcp) that can be opened in the tool. Browsers have a storage
              limit, and it's easy to reach with images uploaded from a device.
              To make patterns smaller, you can upload images to a hosting
              service and use the URL to load them in the tool. Browser patterns
              will be lost if you clear your browser data.
            </Text>
            <Space h="xs" />
            <Text>
              The tool is still in development, so please report any bugs or
              issues you encounter via{' '}
              <a href="https://github.com/s-egge/quilters-canvas/issues">
                Github Issues.
              </a>{' '}
              You can also request new features or improvements there. Checkout
              the{' '}
              <a href="https://github.com/users/s-egge/projects/4">
                project board
              </a>{' '}
              to see what features are already planned.
            </Text>
            <Space h="xs" />
            <Text>
              Currently, the tool is best viewed on a desktop or laptop, though
              it does work on mobile and will eventually be optimized for
              smaller screens.
            </Text>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Modal>
  )
}
