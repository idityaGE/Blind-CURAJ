import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from 'react'
import { handleChangeName } from '@/utils/change-name'
import { PencilLine } from "lucide-react"
import { useToast } from '@/hooks/use-toast'

interface ChangeNameProps {
  onSuccess?: () => void
}

export const ChangeName = ({ onSuccess }: ChangeNameProps) => {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const resetForm = () => {
    setName('')
    setLoading(false)
    setOpen(false)
  }

  async function handleSave() {
    if (!name.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid name",
        description: "Please enter a valid name",
        duration: 3000,
      })
      return
    }

    setLoading(true)
    try {
      await handleChangeName(name)
      toast({
        title: "Success",
        description: "Your name has been updated successfully",
        duration: 3000,
      })
      resetForm()
      onSuccess?.()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update name",
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <PencilLine className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Name</DialogTitle>
          <DialogDescription>
            Enter your new name below. This will be updated across all your devices.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">New Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your new name"
              value={name}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              resetForm()
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}